import {AfterViewInit, Component, inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { Firma } from '../../../interface/firma';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { SelectionModel } from '@angular/cdk/collections';
import { MatButtonModule } from '@angular/material/button';
import Swal from 'sweetalert2'
import { FirmaStorageService } from '../../../service/firma-storage.service';
import { Subscription } from 'rxjs';
import { FiltrosFirmaService } from '../../../service/filtros-firma.service';
import { FiltroFirma } from '../../../interface/FiltroFirma';


const TIPOS_FIRMA: string[] = ['Conjunta', 'Individual'];
const TIPOS_DOCUMENTO: string[] =  ['Laudo', 'Orden Procesal', 'Notificación','Oficio'];
const NROS_CASO: string[] = ['C001-2024-CCL', 'C002-2024-CCL', 'C003-2024-CCL', 'C004-2024-CCL', 'C005-2024-CCL'];

@Component({
  selector: 'app-firma-documento',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule,CommonModule, MatCheckboxModule , MatIconModule, MatButtonModule],
  templateUrl: './firma-documento.component.html',
  styleUrl: './firma-documento.component.scss'
})
export class FirmaDocumentoComponent  implements OnInit, OnDestroy, AfterViewInit {
  displayedColumns: string[] = ['select', 'pdf', 'nroCaso', 'tipoFirma', 'tipoDocumento', 'fechaSolicitud','fechaFirma'];
  dataSource: MatTableDataSource<Firma>;
  selection = new SelectionModel<Firma>(true, []);
  private paginator!: MatPaginator;
  private sort!: MatSort;
  private subscription!: Subscription;
  _filtrosService = inject(FiltrosFirmaService);
  
  filtros: FiltroFirma = {
    tiposDocumento: [] , 
    historico: 0
  };
  
  constructor() {
    
    let firmas = FirmaStorageService.getFirmas();
    if (firmas.length === 0) {
      firmas = Array.from({ length: 20 }, (_, k) => createNewFirma(k + 1));
      FirmaStorageService.saveFirmas(firmas); 
    }

    firmas = firmas.filter(
      (doc) => doc.estado !== 1
    );
    this.dataSource = new MatTableDataSource(firmas);
  }

  ngOnInit(): void {
    this.subscription = this._filtrosService.filtros$.subscribe((filtros) => {
      this.filtros = filtros;
      this.aplicarFiltros(filtros);
    });
  }

  aplicarFiltros(filtros: any) {
    let dataFilter = FirmaStorageService.getFirmas().filter((doc) => {
      return (
        (!filtros.tiposDocumento || filtros.tiposDocumento.length === 0 || filtros.tiposDocumento.includes(doc.tipoDocumento))
      );
    });

    if (filtros.historico === 1) {
      dataFilter = dataFilter.filter((doc) => doc.fechaFirma != null || doc.fechaFirma == null);
    }

    if (filtros.historico === 0) {
      dataFilter = dataFilter.filter((doc) => doc.fechaFirma == null);
    }

    this.dataSource = new MatTableDataSource(dataFilter);
    this.setDataSourceAttributes();
  }

  ngAfterViewInit() {
    this.setDataSourceAttributes();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSourceAttributes();
  }
  
  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.paginator._intl!.itemsPerPageLabel="Registros por página";
    this.setDataSourceAttributes();
  }
  
  setDataSourceAttributes() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  firmar() {
    
    let pendientesdeFirma = this.selection.selected.filter( x => x.estado == 0);

    if (pendientesdeFirma.length == 0) {
      Swal.fire({
        icon: "error",
        text: "No hay elementos seleccionado",
      });
      return;
    }
   

    Swal.fire({
      text: "¿Está seguro de proceder con la firma para los  "+ pendientesdeFirma.length +" documentos seleccionados?",
      showCancelButton: true,
      icon: "warning",
      confirmButtonText: "Guardar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#0e4597",
      cancelButtonColor: "#d33",
    }).then((result) => {
      if (result.isConfirmed) {

        pendientesdeFirma.forEach((documento) => {
          documento.estado = 1; 
          documento.fechaFirma = new Date();
        });
  
       
        const documentosActuales = FirmaStorageService.getFirmas();

        
        const documentosActualizados = documentosActuales.map((doc) =>
          pendientesdeFirma.some((pendiente) => pendiente.id === doc.id)
            ? { ...doc, estado: 1, fechaFirma: new Date() }
            : doc
        );
      
        
        localStorage.setItem('firmas', JSON.stringify(documentosActualizados));
        
        this.aplicarFiltros(this.filtros);
   
        
        this.selection.clear();
        pendientesdeFirma = [];

        Swal.fire("Guardado!", "Los documentos han sido firmados.", "success");
      }
    });
  }
  
   ngOnDestroy() {
    this.subscription.unsubscribe(); 
  }
}



function createNewFirma(id: number): Firma {
  const nroCaso = NROS_CASO[Math.floor(Math.random() * NROS_CASO.length)];
  const tipoFirma = TIPOS_FIRMA[Math.floor(Math.random() * TIPOS_FIRMA.length)];
  const tipoDocumento = TIPOS_DOCUMENTO[Math.floor(Math.random() * TIPOS_DOCUMENTO.length)];
  const fechaSolicitud = new Date(
    2024, 
    Math.floor(Math.random() * 12), 
    Math.floor(Math.random() * 28) + 1 
  );

  return {
    id: id,
    nroCaso: nroCaso,
    tipoFirma: tipoFirma,
    tipoDocumento: tipoDocumento,
    estado: 0,
    fechaSolicitud: fechaSolicitud
  };
}