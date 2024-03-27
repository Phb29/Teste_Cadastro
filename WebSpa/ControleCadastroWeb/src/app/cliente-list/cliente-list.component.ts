import { Component, OnInit } from '@angular/core';
import { Cliente } from '../../Model/cliente.model';
import { ClienteService } from '../../Service/cliente.service';

@Component({
  selector: 'app-cliente-list',
  templateUrl: './cliente-list.component.html',
  styleUrl: './cliente-list.component.scss'
})
export class ClienteListComponent implements OnInit {
   modalAberta = false;
    clienteParaEditar: Cliente | null = null;
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
    constructor(private clienteService: ClienteService) { }

    ngOnInit(): void {
      this.carregarClientes(); 
    }


    carregarClientes(): void {
      this.clienteService.buscarClientes(this.termoDeBusca).subscribe(clientes => {
        this.clientes = clientes;
        this.filtrarClientes();
      });
    }

    editarCliente(cliente: Cliente): void {
      this.clienteService.editarCliente(cliente).subscribe(() => {
        this.carregarClientes();
      });
    }

  deletarCliente(id: number): void {
    this.clienteService.deletarCliente(id).subscribe(
      () => {
        this.clientes = this.clientes.filter(cliente => cliente.id !== id);
  this.carregarClientes();
      },
      error => {
        if (error.status === 404) {
          console.error('Cliente não encontrado para exclusão');
        } else {
          console.error('Ocorreu um erro ao excluir o cliente:', error);
        }
      }
    );
  }

   
 openEditarModal(cliente: Cliente): void {
  this.clienteParaEditar = { ...cliente }; // Copia os dados do cliente para editar
  this.modalAberta = true;
}

  salvarEdicao(): void {
    this.clienteService.editarCliente(this.clienteParaEditar!).subscribe( 
      clienteEditado => {
        const index = this.clientes.findIndex(cliente => cliente.id === this.clienteParaEditar!.id);
        if (index !== -1) {
          this.clientes[index] = clienteEditado;
        }
        this.fecharModal();
  this.carregarClientes();
      },
      error => {
        console.error('Ocorreu um erro ao editar o cliente:', error);
      }
    );
  }

  fecharModal(): void {
    this.modalAberta = false;

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
