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
import { FirmaService } from '../../../service/firma.service';
import { AuthService } from '../../../service/auth.service';
import { FirmaDocumentoRequest } from '../../../interface/request/FirmaDocumentoRequest';
import { FirmaDocumentosRequest } from '../../../interface/request/FirmaDocumentosRequest';
import { MatDialog } from '@angular/material/dialog';
import { FirmaPasswordComponent } from '../firma-password/firma-password.component';


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
  dataSource!: MatTableDataSource<Firma>;
  selection = new SelectionModel<Firma>(true, []);
  private paginator!: MatPaginator;
  private sort!: MatSort;
  private subscription!: Subscription;
  _filtrosService = inject(FiltrosFirmaService);
  _firmaService = inject(FirmaService);
 _authService = inject(AuthService);
 _dialogFirmaPassword = inject(MatDialog);

  filtros: FiltroFirma = {
    tiposDocumento: [] , 
    historico: 0
  };
  
  constructor() {
  }

  ngOnInit(): void {
    this.listarDocumentosPorUsuario();
    this.subscription = this._filtrosService.filtros$.subscribe((filtros) => {
      this.filtros = filtros;
      this.aplicarFiltros(filtros);
    });
  }


  listarDocumentosPorUsuario(){
    var filtro = {
      "idUsuario": this._authService.getIdUserFromLocalStorage(),
      "incluyeHistorico": false
    }

       this._firmaService.ListadoDocumentosPorUsuario(filtro).subscribe({
          next: (response: Firma[]) => {
            this.dataSource = new MatTableDataSource(response);
          },
          error: (error: any) => {
            
          }
        });
  }

  aplicarFiltros(filtros: any) {
    

    var filtro = {
      "idUsuario": this._authService.getIdUserFromLocalStorage(),
      "incluyeHistorico": filtros.historico === 1 ?true :false
    }

       this._firmaService.ListadoDocumentosPorUsuario(filtro).subscribe({
          next: (response: Firma[]) => {
            this.dataSource = new MatTableDataSource(response);
            
            let dataFilter = this.dataSource.data.filter((doc) => {
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
          },
          error: (error: any) => {
            
          }
    });

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
    if(this.dataSource){
      this.paginator = mp;
      this.paginator._intl!.itemsPerPageLabel="Registros por página";
      this.setDataSourceAttributes();
    }

  }
  
  setDataSourceAttributes() {
    if(this.dataSource){
      this.dataSource.paginator = this.paginator;
      this.dataSource!.sort = this.sort;
    }
  
  }

  firmar() {
    let pendientesdeFirma = this.selection.selected;
  
    if (pendientesdeFirma.length == 0) {
      Swal.fire({
        icon: "error",
        text: "No hay elementos seleccionados",
      });
      return;
    }
  
    const configUser = this._authService.getConfigUserFromLocalStorage();

    if(!configUser?.certificadoCargado){
      Swal.fire("Advertencia", "No tiene un certificado digital cargado.", "warning");
      return;
    }
    
    if (configUser.contraseniaCertificadoCargada) {
      this.procederConFirma(pendientesdeFirma, null);
    } else {
      this.openDialogFirmaPassword();
    }
  }

  procederConFirma(pendientesdeFirma: Firma[], contraseniaFirma: string | null){
    let msg = "";
    let msgOk = "";

    if (pendientesdeFirma.length == 1) {
      msg = "¿Está seguro de proceder con la firma para el documento seleccionado?";
      msgOk = "El documento ha sido firmado.";
      
    
      const firmaRequest: FirmaDocumentoRequest = {
        idUsuario: this._authService.getIdUserFromLocalStorage(),
        idDocumento: Number(this.selection.selected[0].id),
      };
  
     
      Swal.fire({
        text: msg,
        showCancelButton: true,
        icon: "warning",
        confirmButtonText: "Sí, Firmar",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#0e4597",
        cancelButtonColor: "#d33",
      }).then((result) => {
        if (result.isConfirmed) {
          this._firmaService.firmarDocumento(firmaRequest).subscribe({
            next: (result: boolean) => {
              this.aplicarFiltros(this.filtros);
              this.selection.clear();
              pendientesdeFirma = [];
  
              Swal.fire("Guardado!", msgOk, "success");
              this.listarDocumentosPorUsuario();
            },
            error: (error) => {
              Swal.fire("Error", "Ha ocurrido un error al intentar firmar el documento.", "error");
              console.log(error);
            },
          });
        }
      });
  
    } else {
      msg = "¿Está seguro de proceder con la firma para los " + pendientesdeFirma.length + " documentos seleccionados?";
      msgOk = "Los documentos han sido firmados.";
  
      
      const firmaRequest: FirmaDocumentosRequest = {
        idUsuario: this._authService.getIdUserFromLocalStorage(),
        idDocumento: pendientesdeFirma.map(doc => doc.id)
      };
  
      
      Swal.fire({
        text: msg,
        showCancelButton: true,
        icon: "warning",
        confirmButtonText: "Guardar",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#0e4597",
        cancelButtonColor: "#d33",
      }).then((result) => {
        if (result.isConfirmed) {
          this._firmaService.firmarDocumentos(firmaRequest).subscribe({
            next: (result: boolean) => {
              this.aplicarFiltros(this.filtros);
              this.selection.clear();
              pendientesdeFirma = [];
  
              Swal.fire("Guardado!", msgOk, "success");
              this.listarDocumentosPorUsuario();
            },
            error: (error) => {
              Swal.fire("Error", "Ha ocurrido un error al intentar firmar los documentos.", "error");
              console.log(error);
            },
          });
        }
      });
    }
  }
  
 openDialogFirmaPassword() {
    const dialogRef = this._dialogFirmaPassword.open(FirmaPasswordComponent, {
      width: '600px', 
      data: {
        title: 'Advertencia',
        message: 'No se ha configurado una contraseña. Por favor, ingresa una contraseña para continuar con el proceso de firma del documento.'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== null) {
        const contraseniafirma = result;
       // this._authService.setContraseniaCertificadoCargada(true); 
        this.procederConFirma(this.selection.selected, contraseniafirma);
      } else {
        console.log('Acción cancelada');
      }
    });
  }

  descargarPdf(firma: Firma): void {
    this._firmaService.descargarPdf(firma.id).subscribe({
      next: (pdfBlob: Blob) => {
      
        const link = document.createElement('a');
        const url = window.URL.createObjectURL(pdfBlob);
        link.href = url;
        link.download = `${firma.nroCaso}_${firma.tipoDocumento}.pdf`; 
        link.click();
        window.URL.revokeObjectURL(url); 
      },
      error: (error) => {
        console.error('Error al descargar el PDF:', error);
      },
      complete: () => {
        console.log('La descarga ha finalizado.');
      }
    });
  }
  
  
   ngOnDestroy() {
    this.subscription.unsubscribe(); 
  }
}
