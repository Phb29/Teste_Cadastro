  import { Component, OnInit } from '@angular/core';
  import { Cliente, Endereco } from '../Model/cliente.model';
  import { ClienteService } from '../Service/cliente.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


  @Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'] // Adicione estilos se necessário
  })
  export class AppComponent implements OnInit {
formGroup?: FormGroup;
    clientes: Cliente[] = [];
  clientesFiltrados: Cliente[] = [];
  termoDeBusca = '';
    novoCliente: Cliente = {
    codigo: '',
    nome: '',
    cnpj: '',
    endereco: { 
      localizacao: '',
      latitude: 0, 
      longitude: 0 
    }
  };
  pageAtual = 0;
    totalPages = 0;
    constructor(private clienteService: ClienteService,private fb: FormBuilder) { }

    ngOnInit(): void {
this.formGroup = this.fb.group({
      codigo: ['', Validators.required],
      nome: ['', Validators.required],
      cnpj: ['', Validators.required],
      localizacao: ['', Validators.required],
      'endereco.latitude': ['', Validators.required],
      'endereco.longitude': ['', Validators.required]
    });
 
      this.carregarClientes();
     this.carregarClientesPaginados(0, 5, 'id', 'asc');
  
    }


    carregarClientes(): void {
      this.clienteService.buscarClientes(this.termoDeBusca).subscribe(clientes => {
        this.clientes = clientes;
        this.filtrarClientes(); // Filtra os clientes após carregar
      });
    }
  criarNovoCliente(): void {
    
    
    this.clienteService.criarCliente(this.novoCliente).subscribe((clienteCriado) => {
      this.clientes.push(clienteCriado);
  this.carregarClientes();
      this.resetNovoCliente(); 
   window.location.reload();
    });
  }


 carregarClientesPaginados(page: number, size: number, sortBy: string, direction: string): void {
  this.clienteService.getClientesPaginados(page, size, sortBy, direction).subscribe(response => {
    this.clientes = response.content;
    this.pageAtual = response.number;
    this.totalPages = response.totalPages;
  });
}
    
    private resetNovoCliente(): void {
      this.novoCliente = {
        codigo: '',
        nome: '',
        cnpj: '',
        endereco: { localizacao: '' }
      };
    }
 
  carregarPaginaAnterior(): void {
      if (this.pageAtual > 0) {
        this.pageAtual--;
        this.carregarClientesPaginados(this.pageAtual, 5, 'id', 'asc');
      }
    }

   
    carregarProximaPagina(): void {
      if (this.pageAtual < this.totalPages - 1) {
        this.pageAtual++;
        this.carregarClientesPaginados(this.pageAtual, 5, 'id', 'asc');
      }
    }

  filtrarClientes(): void {
    this.clientesFiltrados = this.clientes.filter(cliente =>
      cliente.nome.toLowerCase().includes(this.termoDeBusca.toLowerCase())
    );
  }
 buscarLatitudeLongitude(cep: string): void {
    this.clienteService.buscarLatitudeLongitudeCEP(cep).subscribe((response) => {
      if (response.status === 'OK' && response.results.length > 0) {
        const location = response.results[0].geometry.location;
        this.novoCliente.endereco.latitude = location.lat;
        this.novoCliente.endereco.longitude = location.lng;
      } else {
        console.error('Não foi possível encontrar a latitude e longitude para o CEP fornecido.');
      }
    });
  }

  }

