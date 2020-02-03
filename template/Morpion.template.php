<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
        <title>Morpion V4 (Tic Tac Toe)</title>
        
        <!-- Chargement des différentes polices (symboles X et O, nom des joueurs, résultat...) -->
        <link href="https://fonts.googleapis.com/css?family=Varela+Round|Indie+Flower|Acme&display=swap" rel="stylesheet">

        <!-- Normalisation / réinitialisation des styles CSS-->
        <link rel="stylesheet" 
              href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css" 
              integrity="sha256-l85OmPOjvil/SOvVt3HnSSjzF1TUMyT9eV0c2BzEGzU=" 
              crossorigin="anonymous" />
        
        <!-- CSS local -->
        <link rel="stylesheet" href="../css/Morpion.css">
	</head>
	<body>
        <main id="wrapper">
            <section id="joueur-1" class="joueur">
                <h1 id="nom-1"><?=$nomJ1?></h1>
                <p id="symbole-1" class="symbole">&nbsp;</p>
                <p id="resultat-1" class="resultat">&nbsp;</p>
                <p id="score-1" class="score">&nbsp;</p>
            </section>
            <section id="jeu">
                <p id="taille"><?=$taille?></p>
                <div id="grille"></div>
                <div id="rejouer"> 
                    <a href="#" id="suivant" class="bouton">Partie suivante</a>
                    <a href="../index.html" id="reinit" class="bouton">Réinitialiser</a>
                </div>
            </section>
            <section id="joueur-2" class="joueur">
                <h1 id="nom-2"><?=$nomJ2?></h1>
                <p id="symbole-2" class="symbole">&nbsp;</p>
                <p id="resultat-2" class="resultat">&nbsp;</p>
                <p id="score-2" class="score">&nbsp;</p>
            </section>
        </main>
	
        <!-- Inclusion de la bibliothèque jQuery -->
        <script
            src="https://code.jquery.com/jquery-3.4.1.min.js"
            integrity="sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo="
            crossorigin="anonymous">
        </script>

        <!-- jQuery/Javascript local -->
        <script src="../js/Morpion.js"></script>
	</body>
</html>







