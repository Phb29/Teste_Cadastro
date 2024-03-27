import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { Cliente } from '../Model/cliente.model';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private apiUrl = 'http://localhost:8080/api/clientes';

  constructor(private http: HttpClient) { }

  getClientes(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.apiUrl);
  }

  getCliente(id: number): Observable<Cliente> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Cliente>(url);
  }

 criarCliente(cliente: Cliente): Observable<Cliente> {
    // Verifica se o endereço do cliente possui os campos latitude e longitude
    if (!cliente.endereco.latitude || !cliente.endereco.longitude) {
        console.error('Latitude e/ou longitude não estão definidas no endereço do cliente.');
        return throwError('Latitude e/ou longitude não estão definidas no endereço do cliente.');
    }
    return this.http.post<Cliente>(this.apiUrl, cliente);
}

  editarCliente(cliente: Cliente): Observable<Cliente> {
    const url = `${this.apiUrl}/${cliente.id}`;
    return this.http.put<Cliente>(url, cliente);
}

  deletarCliente(id: number): Observable<string> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<string>(url);
  }
  

  buscarClientes(termo: string): Observable<Cliente[]> {
  const url = `${this.apiUrl}/buscar?keyword=${termo}`;
  return this.http.get<Cliente[]>(url);
}
getClientesPaginados(page: number, size: number, sortBy: string, direction: string): Observable<any> {
    const url = `${this.apiUrl}/paginado`;
    let params = new HttpParams();
    params = params.append('page', page.toString());
    params = params.append('size', size.toString());
    params = params.append('sortBy', sortBy);
    params = params.append('direction', direction);
    return this.http.get<any>(url, { params: params });
  }
 buscarLatitudeLongitudeCEP(cep: string): Observable<any> {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${cep}&key=AIzaSyAy_FP6Er9xcN2rsu_puS2tVQ_oKjIlLKo`;
    return this.http.get<any>(url);
  }
}
