import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { ApiServiceProvider } from 'src/providers/api-service/api-service';
import { EditarAlumnoPage } from '../editar-alumno/editar-alumno.page';
import { Alumno } from '../modelo/Alumno';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  private alumnos = new Array<Alumno>();

  constructor(private apiService: ApiServiceProvider,
    public alertController: AlertController,
    public modalController: ModalController) {
  }

  ngOnInit(): void {
    this.apiService.getAlumnos()
      .then((alumnos: Alumno[]) => {
        this.alumnos = alumnos;
        console.log(this.alumnos);
      })
      .catch((error: string) => {
        console.log(error);
      });
  }

  eliminarAlumno(indice: number) {
    this.apiService.eliminarAlumno(this.alumnos[indice].id)
      .then((correcto: boolean) => {
        console.log("Borrado correcto del alumno con indice: " + indice);
        this.alumnos.splice(indice, 1);
      })
      .catch((error: string) => {
        console.log("Error al borrar: " + error);
      });
  }
  /*
    async modificarAlumno(indice: number) {
      let alumno = this.alumnos[indice];
      const alert = await this.alertController.create({
        header: 'Modificar',
        inputs: [
          {
            name: 'first_name',
            type: 'text',
            value: alumno.first_name,
            placeholder: 'first_name'
          },
          {
            name: 'last_name',
            type: 'text',
            id: 'last_name',
            value: alumno.last_name,
            placeholder: 'last_name'
          },
          {
            name: 'email',
            id: 'email',
            type: 'text',
            value: alumno.email,
            placeholder: 'email'
          },
          {
            name: 'gender',
            id: 'gender',
            type: 'text',
            value: alumno.gender,
            placeholder: 'gender'
          },
          {
            name: 'avatar',
            value: alumno.avatar,
            type: 'url',
            placeholder: 'avatar'
          },
          {
            name: 'address',
            value: alumno.address,
            type: 'text',
            placeholder: 'address'
          },
          {
            name: 'city',
            value: alumno.city,
            type: 'text',
            placeholder: 'city'
          }
        ],
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
              console.log('Confirm Cancel');
            }
          }, {
            text: 'Ok',
            handler: (data) => {
              console.log(data);
              var alumnoModificado: Alumno = new Alumno(alumno.id,
                data['first_name'],
                data['last_name'],
                data['email'],
                data['gender'],
                data['avatar'],
                data['address'],
                data['city'],
                data['postalCode']);
              this.apiService.modificarAlumno(alumno.id, alumnoModificado)
                .then((alumno: Alumno) => {
                  this.alumnos[indice] = alumno;
                })
                .catch((error: string) => {
                  console.log(error);
                });
              console.log('Confirm Ok');
            }
          }
        ]
      });
  
      await alert.present();
    }*/

  async modificarAlumno(indice: number) {
    const modal = await this.modalController.create({
      component: EditarAlumnoPage,
      componentProps: {
        'alumnoJson': JSON.stringify(this.alumnos[indice])
      }
    });

    modal.onDidDismiss().then((data) => {
      if (data['data'] != null) {
        let alumnoJSON = JSON.parse(data['data']);
        let alumnoModificado: Alumno = Alumno.createFromJsonObject(alumnoJSON);
        this.apiService.modificarAlumno(alumnoModificado.id, alumnoModificado)  //se hace PUT a la API
          .then((alumno: Alumno) => {
            this.alumnos[indice] = alumno;  //si se ha modificado en la api se actualiza en la lista
          })
          .catch((error: string) => {
            console.log(error);
          });
      }
    });

    return await modal.present();
  }

}
