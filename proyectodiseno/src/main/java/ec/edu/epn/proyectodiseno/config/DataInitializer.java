package ec.edu.epn.proyectodiseno.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import ec.edu.epn.proyectodiseno.model.entity.Usuario;
import ec.edu.epn.proyectodiseno.model.enums.TipoRol;
import ec.edu.epn.proyectodiseno.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;

@Configuration
@RequiredArgsConstructor
public class DataInitializer {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    CommandLineRunner initDatabase() {
        return args -> {
            // Crear usuario admin por defecto si no existe
            if (!usuarioRepository.existsByCorreo("admin@epn.edu.ec")) {
                Usuario admin = Usuario.builder()
                        .codigo("ADMIN001")
                        .nombre("Administrador")
                        .correo("admin@epn.edu.ec")
                        .contrasena(passwordEncoder.encode("admin123"))
                        .tipoRol(TipoRol.ADMINISTRADOR)
                        .build();
                
                usuarioRepository.save(admin);
                System.out.println("=================================================");
                System.out.println("Usuario administrador creado:");
                System.out.println("Correo: admin@epn.edu.ec");
                System.out.println("Contraseña: admin123");
                System.out.println("=================================================");
            }
        };
    }
}
