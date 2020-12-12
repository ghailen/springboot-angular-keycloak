# springboot-angular-keycloak
1) ecom-app : Spring + Thymeleaf
2) keycloak-app : Angular 9
3) supplierService : Micro Service Spring

ce projet se compose de deux micro service : products et suppliers
be product : en spring boot tymleaf: partie fe) qui contient la liste des produits et l'afficher en connectant sur keycloak et récuere la liste des suppliers à l'aide de keycloak rest template en passant le 
token d'authent dans le header
be suppliers : sécuriser et peut le lire lorsque que le role de user est app-manager
front meme que tymleaf: se connecte à keycloak permet d'afficher la liste de produit(sans besoin de s'authentifier) et de se connecter , changer le mot de passe
et de se déconnecter et d'afficher la listes des suppliers(que si le role de user est app-manager)

