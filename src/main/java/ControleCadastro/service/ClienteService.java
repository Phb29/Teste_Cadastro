package ControleCadastro.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import ControleCadastro.Model.Cliente;
import ControleCadastro.repository.ClienteRepository;
import ControleCadastro.repository.EnderecoRepository;

@Service
public class ClienteService {
	@Autowired
	private ClienteRepository clienteRepository;

	@Autowired 
	private EnderecoRepository enderecoRepository;

	public List<Cliente> clientes() {
		return clienteRepository.findAll();
	}

	public Cliente criar(Cliente cliente) {

		if (cliente.getEndereco() != null && cliente.getEndereco().getId() != null) {
			cliente.setEndereco(enderecoRepository.getById(cliente.getEndereco().getId()));
		}

		return clienteRepository.save(cliente);
	}

	public Cliente editar(Cliente cliente, Long id) {
		Cliente clienteExistente = clienteRepository.findById(id).orElse(null);
		if (clienteExistente != null) {
			cliente.setId(id);
			return clienteRepository.save(cliente);
		} else {
			return null;
		}
	}

	public String deletar(long id) {
		if (clienteRepository.existsById(id)) {
			clienteRepository.deleteById(id);
			return "Cliente excluído com sucesso";
		} else {
			return "Cliente não encontrado";
		}
	}

	public Cliente cliente(Long id) {
		return clienteRepository.findById(id).orElseThrow();
	}

	public Page<Cliente> findPaginatedAndSorted(int page, int size, String sortBy, String direction) {
		Sort.Direction sortDirection = Sort.Direction.fromString(direction.toUpperCase());

		Pageable pageable = PageRequest.of(page, size, sortDirection, sortBy);

		return clienteRepository.findAll(pageable);
	}

	public List<Cliente> search(String keyword) {

		return clienteRepository.findByNomeContainingIgnoreCase(keyword);
	}
}