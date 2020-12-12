package org.sid.ecomapp;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.keycloak.adapters.AdapterDeploymentContext;
import org.keycloak.adapters.KeycloakDeployment;
import org.keycloak.adapters.spi.HttpFacade;
import org.keycloak.adapters.springboot.KeycloakSpringBootConfigResolver;
import org.keycloak.adapters.springsecurity.KeycloakConfiguration;
import org.keycloak.adapters.springsecurity.client.KeycloakClientRequestFactory;
import org.keycloak.adapters.springsecurity.client.KeycloakRestTemplate;
import org.keycloak.adapters.springsecurity.config.KeycloakWebSecurityConfigurerAdapter;
import org.keycloak.adapters.springsecurity.facade.SimpleHttpFacade;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.hateoas.PagedModel;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.session.SessionRegistryImpl;
import org.springframework.security.web.authentication.session.RegisterSessionAuthenticationStrategy;
import org.springframework.security.web.authentication.session.SessionAuthenticationStrategy;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private double price;
}

interface ProductRepository extends JpaRepository<Product, Long> {

}

@Controller
class ProductController {
    @Autowired
    private ProductRepository productRepository;

    @GetMapping("/")
    public String index() {
        return "index";
    }


    @GetMapping("/products")
    public String index(Model model) {
        model.addAttribute("products", productRepository.findAll());
        return "products";
    }

}

@SpringBootApplication
public class EcomAppApplication {

    public static void main(String[] args) {
        SpringApplication.run(EcomAppApplication.class, args);
    }

    @Bean
    CommandLineRunner start(ProductRepository productRepository) {
        return args -> {
            productRepository.save(new Product(null, "ord HP 564", 800));
            productRepository.save(new Product(null, "imprimante LX 11", 100));
            productRepository.save(new Product(null, "Smart phone samsung s20", 9900));
            productRepository.findAll().forEach(p -> {
                System.out.println(p.getName());
            });
        };

    }
}

@Configuration
class keycloakConfig {
    @Bean
    KeycloakSpringBootConfigResolver configResolver() {
        return new KeycloakSpringBootConfigResolver();
    }


    @Bean
    KeycloakRestTemplate keycloakRestTemplate(KeycloakClientRequestFactory keycloakClientRequestFactory){
        return new KeycloakRestTemplate(keycloakClientRequestFactory);
    }
}


@KeycloakConfiguration
class KeycloakSpringSecurityConfig extends KeycloakWebSecurityConfigurerAdapter {

    @Override
    protected SessionAuthenticationStrategy sessionAuthenticationStrategy() {
        return new RegisterSessionAuthenticationStrategy(new SessionRegistryImpl());
    }

    //deleger la connexion à keycloak
    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.authenticationProvider(keycloakAuthenticationProvider());
    }

    //gestion des autorisations
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        super.configure(http);
        // .autheticated (juste le client peut acceder s'il est authentifié
        http.authorizeRequests().antMatchers("/products/**").authenticated();
    }
}


@Controller
class SecurityController {

    @Autowired
    private AdapterDeploymentContext adapterDeploymentContext;

    @GetMapping("/logout")
    public String logout(HttpServletRequest request) throws ServletException {
        request.logout();
        return "redirect:/";
    }

    @GetMapping("/changePassword")
    public String changePassword(RedirectAttributes attributes, HttpServletRequest request, HttpServletResponse response) throws ServletException {
        HttpFacade facade = new SimpleHttpFacade(request, response);
        KeycloakDeployment deployment = adapterDeploymentContext.resolveDeployment(facade);
        attributes.addAttribute("referrer", deployment.getResourceName());
        attributes.addAttribute("referrer_uri", request.getHeader("referer"));

        return "redirect:" + deployment.getAccountUrl() + "/password";
    }


    @Controller
    class SupplierController {

        @Autowired
        private KeycloakRestTemplate keycloakRestTemplate;

        @GetMapping("/suppliers")
        public String index(Model model) {
            ResponseEntity<PagedModel<org.sid.ecomapp.Supplier>> response =
                    keycloakRestTemplate.exchange("http://localhost:8083/suppliers", HttpMethod.GET, null,
                            new ParameterizedTypeReference<PagedModel<Supplier>>() {});
         //   return response.getBody().getContent();

            model.addAttribute("suppliers", response.getBody().getContent());
            return "suppliers";
        }

    }

    @ExceptionHandler(Exception.class)
    public String exceptionHandler(){

        return "errors";
    }

}

@Data
class Supplier{
    private Long id;
    private String name;
    private String email;
}