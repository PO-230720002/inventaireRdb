#Site pour l'inventaire de Robin des Bio

Premier disclaimer : c'est moche 
Second disclaimer : ce n'est pas connecté à l'api pour le moment

#1 Comment l'installer  ?
git clone https://github.com/PO-230720002/inventaireRdb.git

#2 Comment l'utiliser depuis un Téléphone
##A)Sur son ordi
1) Se mettre sur le même wifi depuis son ordi et son telephone
2) Avoir python
3) Ouvrir le Terminal depuis le projet télécharger
4) exécuter la commande "python server_https"
5) ouvrir un terminal de commande
6) executer ipConfig
7) Récupérer dans "Carte réseau sans fil Wi-Fi :" la valeur de "Adresse IPv4"
   on appellera la valeur <ipOrdi>
##B) Sur son téléphone
9) Sur son navigateur web taper https://<ipOrdi>:8000
10) Autoriser la caméra

ATTENTION : 
L'utilisation de *https* est obligatoire car sinon l'utilisation 
de la caméra n'est pas toujours autorisé par le navigateur
