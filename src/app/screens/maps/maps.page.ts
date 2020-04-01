/// <reference types="@types/googlemaps" />
import { Component, OnInit } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
  import { HttpService } from "../../services/Http/http.service";
import { AlertController,LoadingController } from '@ionic/angular';
import { v4 as uuidv4 } from 'uuid';
@Component({
  selector: 'app-maps',
  templateUrl: './maps.page.html',
  styleUrls: ['./maps.page.scss'],
})
export class MapsPage implements OnInit {

  constructor(
    private geolocation: Geolocation,
    private http: HttpService,
    public alertController: AlertController,
    public loadingController:LoadingController
  ) { }

  my_lat : number = 0;
  my_long : number = 0;
  markers : Array<any> = <any>[];
  markers_map : Array<any> = <any>[];
  map : any;
  type: string = "sucursal";
  directionsDisplay: any = null;
  navigating : boolean = false;

  async ngOnInit() {
    await this.getCurrentPosition();
    this.loadMap();
    this.loadBankInfo();
  }

  async getCurrentPosition(){
      const current_position = await this.geolocation.getCurrentPosition();
      this.my_lat =  current_position.coords.latitude;
      this.my_long =  current_position.coords.longitude;
  }

  loadMap() {
      let my_map: HTMLElement = document.getElementById('map-container');
      let map = new google.maps.Map(my_map, {
        center: {
            lat:this.my_lat,
            lng:this.my_long
        },
        zoom: 15,
        streetViewControl: false,
        disableDefaultUI: true
      });
      this.map = map;
      const marker = new google.maps.Marker({
        position: {
          lat: this.my_lat,
          lng: this.my_long
        },
        map: map
      });

       var directionsService = new google.maps.DirectionsService();
  }

  async loadBankInfo(){

      this.markers = [];
      this.clearAllMarkers();
      this.navigating=false;
      if(this.directionsDisplay)
        this.directionsDisplay.setMap(null);

      var type=29;
      if(this.type!="atms")
          type=28;

      const loading = await this.loadingController.create({
        message: 'Cargando ubicaciones...'
      });

      await loading.present();
      let url_cors = "https://cors-anywhere.herokuapp.com/";
      let url_bgeneral =  "https://www.bgeneral.com/wp-admin/admin-ajax.php?action=asl_load_stores&nonce=5c2d1eac5d&load_all=1&layout=1&category="+type
      var data = await this.http.getHttp(url_cors + url_bgeneral);
      await loading.dismiss();

      for (let i = 0; i < data.data.length; i++) {
        const element = data.data[i];
        this.markers.push({
            "lat":element.lat,
            "lng":element.lng,
            "title":element.title,
            "show":true,
            "id":uuidv4()
        });
      }

      this.renderMarkers();
  }

  renderMarkers(){

    var icon = {
        url:
        ( this.type=="atms" ?
          "https://cdn4.iconfinder.com/data/icons/personal-business-finance-gray-series-set-2/64/gray-72-512.png" :
          "https://cdn3.iconfinder.com/data/icons/map-markers-1/512/financial-512.png"
        ),
        scaledSize: new google.maps.Size(40, 40), // scaled size
        origin: new google.maps.Point(0,0), // origin
        anchor: new google.maps.Point(0, 0) // anchor
    };

    for (let i = 0; i < this.markers.length; i++) {

        const element = this.markers[i];
        const marker = new google.maps.Marker({
          position: {
            lat: parseFloat(element.lat),
            lng: parseFloat(element.lng)
          },
          map: this.map,
          icon:icon
        });

        marker.addListener('click', async() => {

          const loading = await this.loadingController.create({
            message: 'Calculando ruta...'
          });

          await loading.present();
          let url_cors = "https://cors-anywhere.herokuapp.com/";
          let url_distance = "https://maps.googleapis.com/maps/api/distancematrix/json?origins="+this.my_lat+","+this.my_long+"&destinations="+element.lat+","+element.lng+"&mode=driving&key=AIzaSyBBQLV-yE6JWTRii0w8qJGsCcsgGHz4l9g";
          let result_distance = await this.http.getHttp(url_cors+url_distance);
          await loading.dismiss();

          var message = "";


          if(result_distance.data.rows[0] && result_distance.data.rows[0].elements[0]){
              let stimated_trip = result_distance.data.rows[0].elements[0].duration;
              message = "Te encuentras a " + stimated_trip.text + " de distancia manejando de sitio, deseas navegar?"
          }else{
              message = "deseas navegar a este sitio?"
          }

          const alert = await this.alertController.create({
            header: element.title,
            message: message,
            buttons: [
              {
                text: 'Cancelar',
                role: 'cancel',
                cssClass: 'secondary',
                handler: (blah) => {
                }
              }, {
                text: 'Ir',
                handler: () => {
                  this.clearAllMarkers();
                  this.navigating = true;
                  this.displayRoute(this.my_lat,this.my_long,element.lat,element.lng);
                }
              }
            ]
          });

           await alert.present();
        });

        this.markers_map.push(marker);
    }

  }

  changeType(type){
      this.type = type;
      this.loadBankInfo();
  }

  clearAllMarkers(){
      for (let i = 0; i < this.markers_map.length; i++) {
        const marker = this.markers_map[i];
        marker.setMap(null);
      }
  }


  displayRoute(actualLat,actualLong, destLat,destLong) {

    var start = new google.maps.LatLng(actualLat, actualLong);
    var end = new google.maps.LatLng(destLat, destLong);

    var directionsDisplay = new google.maps.DirectionsRenderer();// also, constructor can get "DirectionsRendererOptions" object
    this.directionsDisplay = directionsDisplay;
    directionsDisplay.setMap(this.map); // map should be already initialized.

    var request = {
        origin : start,
        destination : end,
        travelMode : google.maps.TravelMode.DRIVING
    };
    var directionsService = new google.maps.DirectionsService();
    directionsService.route(request, (response, status) => {
        if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
        }
    });
  }
}
