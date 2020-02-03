<?php
    if (isset($_GET["nom-j1"]) && isset($_GET["nom-j2"]) && isset($_GET["dim"])) {
        
        ob_start () ;

        $nomJ1 = htmlentities($_GET["nom-j1"]) ;
        $nomJ2 = htmlentities($_GET["nom-j2"]) ;
        $taille = $_GET["dim"] ;

        ob_get_clean() ;

        require "../template/Morpion.template.php" ;
    }
?>