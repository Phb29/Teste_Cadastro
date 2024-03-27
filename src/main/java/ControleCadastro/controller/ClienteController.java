package ControleCadastro.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import ControleCadastro.Model.Cliente;
import ControleCadastro.service.ClienteService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/clientes")
@CrossOrigin(origins = "*")
public class ClienteController {

	@Autowired
	private ClienteService clienteService;

	@GetMapping
	public ResponseEntity<List<Cliente>> todosClientes() {
		List<Cliente> listaDeClientes = clienteService.clientes();
		return ResponseEntity.ok(listaDeClientes);
	}

	@GetMapping("/{id}")
	public ResponseEntity<Cliente> clienteUnico(@Valid @PathVariable Long id) {
		return ResponseEntity.ok(clienteService.cliente(id));
	}

	@PostMapping
	public ResponseEntity<Cliente> criarCliente(@Valid @RequestBody Cliente cliente) {
		Cliente createdCliente = clienteService.criar(cliente);
		return ResponseEntity.ok(createdCliente);
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deletarCliente(@PathVariable Long id) {
		String mensagem = clienteService.deletar(id);
		if (mensagem.equals("Cliente excluído com sucesso")) {
			return ResponseEntity.ok().build();
		} else {
			return ResponseEntity.notFound().build();
		}
	}

	@PutMapping("/{id}")
	public ResponseEntity<Cliente> editarCliente(@Valid @PathVariable Long id, @RequestBody Cliente cliente) {
		Cliente clienteEditado = clienteService.editar(cliente, id);
		if (clienteEditado != null) {
			return ResponseEntity.ok(clienteEditado);
		} else {
			return ResponseEntity.notFound().build();
		}
	}

	@GetMapping("/api/cep/{cep}")
	public String buscarLatitudeLongitude(@PathVariable String cep) {
		RestTemplate restTemplate = new RestTemplate();
		String apiKey = "SUA_CHAVE_API_DO_GOOGLE_MAPS";
		String url = "https://maps.googleapis.com/maps/api/geocode/json?address=" + cep + "&key=" + apiKey;
		String response = restTemplate.getForObject(url, String.class);
		return response;
	}

	@GetMapping("/paginado")
	public ResponseEntity<Page<Cliente>> getClientesPaginados(@RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "5") int size, @RequestParam(defaultValue = "id") String sortBy,
			@RequestParam(defaultValue = "asc") String direction) {
		Page<Cliente> clientesPage = clienteService.findPaginatedAndSorted(page, size, sortBy, direction);
		return ResponseEntity.ok(clientesPage);
	}

	@GetMapping("/buscar")
	public ResponseEntity<List<Cliente>> buscarClientesPorNome(@RequestParam String keyword) {
		List<Cliente> clientes = clienteService.search(keyword);
		return ResponseEntity.ok(clientes);
	}
}
