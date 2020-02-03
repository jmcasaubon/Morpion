var symb1 = 'X'
var symb2 = 'O'
var nbCoups = 0
var tScore  = [0, 0]
var tValeur = [-1, 1]
var maxIter = 0

const ITERMAX = 20000000                // On arrête la recherche si ce nombre d'itérations est atteint !

// var jCour = Math.round(Math.random())
var jCour = 0 // C'est toujours le joueur humain qui commence !

$(document).ready(function() { // Une fois que le document HTML/CSS a bien été complètement chargé...
    let taille = parseInt($("#taille").text())
    let nomIA  = $("#joueur-2").text()

    construireGrille(taille)            // On construit la grille de jeu...
    nouvellePartie()                    // On lance la 1ère partie...
    $("#suivant").click(nouvellePartie) // Et on prépare le lancement des suivantes une fois celle-ci terminée !

    function gererUnePartie() {         // Cette fonction est appelée à chaque tour de jeu (événement "click" du joueur courant "jCour" sur l'une des cases)

        $(this).text(tJoueur[jCour])    // On affiche le symbole du joueur dans la case cliquée  
        $(this).unbind("click")         // Et on désactive immédiatement l'événement "click" sur cette même case (elle n'est plus jouable !)

        switch (verifSchema(taille)) {
            case 0:                                     // Match nul
                $("#rejouer").css ('display', 'flex')   // On rend le bouton "Rejouer" visible
                $("#resultat-1").html("Match&nbsp;nul") // On affiche le résultat nul pour chaque joueur
                $("#resultat-2").html("Match&nbsp;nul") // On affiche le résultat nul pour chaque joueur
                jCour = Math.round(Math.random())       // On tire au hasard le 1er joueur pour la prochaine partie
                break 
            
            case 1:                                     // Victoire d'un joueur (c'est forcément le joueur courant !)
                $("#rejouer").css ('display', 'flex')   // On rend le bouton "Rejouer" visible
                $("#resultat-"+(jCour+1)).html("Vainqueur&nbsp;&excl;") // On affiche la victoire pour le joueur courant
                $(".case").unbind("click")              // On enlève la possibilité de cliquer sur les cases restantes (en fait, toutes les cases !)
                tScore[jCour]++                         // On incrémente le score du joueur courant
                $("#score-"+(jCour+1)).text("Score : "+tScore[jCour]+(tScore[jCour]>1 ? " pts" : " pt"))
                jCour = 1 - jCour                       // Pour la prochaine partie, c'est le perdant qui commencera (l'autre joueur)
                break
            
            default:                                    // Le jeu se poursuit
                jCour = 1 - jCour                       // On passe au joueur suivant ...
                bordure()                               // On change la bordure indiquant le joueur actif...
                setTimeout(gererIA, 100)                // Et on vérifie si c'est à l'I.A de jouer (apres 100ms, pour avoir le temps d'afficher le symbole précédent)
                break
        }
    }

    function initGrille(lim = 3) {
        let tSymb = new Array(lim) 
        for (let dim = 0 ; dim < lim ; dim++) {
            tSymb[dim] = new Array(lim) 
        }

        // console.log("tSymb[][] créé !")

        for (let lgn = 1 ; lgn <= lim ; lgn++) {
            for (let col = 1 ; col <= lim ; col++) {
                let iVal = tJoueur.indexOf($("#case-"+lgn+"-"+col).text())
                tSymb[lgn-1][col-1] = (iVal == -1) ? 0 : tValeur[iVal]
            }
        }

        // console.log("tSymb[][] initialisé !")

        return tSymb
    }

    function afficheGrille(lim = 3, grille) {
        let sGrille = "["

        for (let lgn = 0 ; (lgn < lim) ; lgn++) {
            sGrille += "["
            for (let col = 0 ; (col < lim) ; col++) {
                
                if (grille[lgn][col] == 0) 
                    sGrille += " "
                else
                    sGrille += ((grille[lgn][col] == -1) ? tJoueur[0] : tJoueur[1])
            }
            sGrille += "]"
        }
        sGrille += "]"

        return sGrille
    }

    function scoreGrille(lim = 3, grille, prof) {
        let sDg1 = 0
        let sDg2 = 0
        let score = 0

        for (let lgn = 0 ; (score == 0) && (lgn < lim) ; lgn++) {
            let sLgn = 0
            let sCol = 0

            for (let col = 0 ; (score == 0) && (col < lim) ; col++) {
                sLgn += grille[lgn][col]
                sCol += grille[col][lgn]

                if (Math.abs(sLgn) == lim) {
                    score = sLgn / lim
                } else if (Math.abs(sCol) == lim) {
                    score = sCol / lim
                } else {
                    if (lgn == col) 
                        sDg1 += grille[lgn][col]    
                    if ((lgn + col) == (lim- 1)) 
                        sDg2 += grille[lgn][col]
                }
            }           
        }

        if (Math.abs(sDg1) == lim) {
            score = sDg1 / lim
        } else if (Math.abs(sDg2) == lim) {
            score = sDg2 / lim
        } 

        score *= ((lim * lim) - prof)

        // console.log ("Evaluation grille    ["+prof+"] = "+score)
        return score
    }

    function valMax (lim, grille, lgn, col, val, prof) {
        grille[lgn][col] = val
        maxIter ++
        
        // console.log ("Récursion [valMax()] ["+prof+"] < "+afficheGrille(lim, grille))

        let score = scoreGrille (lim, grille, prof)
    
        if ((Math.abs(score) == 0) && (maxIter < ITERMAX)) {
            score = -((lim * lim ) + 1)

            for (let lgn2 = 0 ; lgn2 < lim ; lgn2++) {
                for (let col2 = 0 ; col2 < lim ; col2++) {
                    if (grille[lgn2][col2] == 0) { // Prochaine position vide => à évaluer
                        next = valMin (lim, grille, lgn2, col2, -(val), (prof + 1))
                        score = Math.max (score, next)
                    }
                }
            }
        }

        // console.log ("Récursion [valMax()] ["+prof+"] > "+afficheGrille(lim, grille))
        // console.log ("Récursion [valMax()] ["+prof+"] = "+score)

        grille[lgn][col] = 0

        return score ;
    }

    function valMin (lim, grille, lgn, col, val, prof) {
        grille[lgn][col] = val
        maxIter ++

        // console.log ("Récursion [valMin()] ["+prof+"] < "+afficheGrille(lim, grille))

        let score = scoreGrille (lim, grille, prof)
     
        if ((Math.abs(score) == 0) && (maxIter < ITERMAX)) {
            score = (lim * lim) + 1

            for (let lgn1 = 0 ; lgn1 < lim ; lgn1++) {
                for (let col1 = 0 ; col1 < lim ; col1++) {
                    if (grille[lgn1][col1] == 0) { // Prochaine position vide => à évaluer
                        next = valMax (lim, grille, lgn1, col1, -(val), (prof +1))
                        score = Math.min (score, next)
                    }
                }
            }
        }

        // console.log ("Récursion [valMin()] ["+prof+"] > "+afficheGrille(lim, grille))
        // console.log ("Récursion [valMin()] ["+prof+"] = "+score)

        grille[lgn][col] = 0

        return score 
    }

    function minMax (lim = 3, grille) {
        let coup = [0, 0]
        let maximum = -((lim * lim) + 1)
        let val = jCour 
        let prof = 1 

        maxIter = 0
        
        for (let lgn = 0 ; lgn < lim ; lgn++) {
            for (let col = 0 ; col < lim ; col++) {
                if (grille[lgn][col] == 0) { // Prochaine position vide => à évaluer
                    let score = valMin (lim, grille, lgn, col, val, prof)
                    if (score > maximum) {
                        maximum = score
                        coup = [lgn, col]
                    }
                }
            }
        }

        // console.log ("Grille parcours [minMax] = ["+coup[0]+" ; "+coup[1]+"]")

        return coup
    }

    function gererIA() {
        if (jCour == 1) {
            let tGrille = initGrille (taille)

            // console.log ("############################################")
            // console.log ("Grille courante [Coup "+nbCoups+"] : "+afficheGrille(taille, tGrille))
            // console.log ("############################################")

            let tCoup = minMax (taille, tGrille)
            
            // console.log ("############################################")
            // console.log ("Parcours acheve [Coup "+nbCoups+"] = ["+tCoup[0]+" ; "+tCoup[1]+"]")
            // console.log ("############################################")

            $("#case-"+((tCoup[0]*1)+1)+"-"+((tCoup[1]*1)+1)).trigger("click")
        }
    }

    function construireGrille (lim = 3) {
        let table = ""
        table += "<table id='zone'><tbody>"
        for (let lgn = 1 ; lgn <= lim ; lgn ++) {
            table += "<tr>"
            for (let col = 1 ; col <= lim ; col ++) {
                table += "<td id='case-"+lgn+"-"+col+"' class='case'></td>"
            }
            table += "</tr>"
        }
        table += "</tbody></table>"
        $("#grille").html(table)
    }

    function nouvellePartie() {
        // On réinitialise le tableau des symboles selon le joueur actif
        tJoueur = (jCour ? [symb2, symb1] : [symb1, symb2])

        // On affiche la bordure indiquant le joueur actif
        bordure()

        // On reaffecte les symboles selon le 1er joueur (qui a toujours le symbole n° 1)
        $("#symbole-1").text(tJoueur[0])
        $("#symbole-2").text(tJoueur[1])

        // On efface l'indicateur de résultat de la partie précédente
        $("#resultat-1").html("&nbsp;")
        $("#resultat-2").html("&nbsp;")

        // On affiche les scores des joueurs
        $("#score-1").text("Score : "+tScore[0]+(tScore[0] > 1 ? " pts" : " pt"))
        $("#score-2").text("Score : "+tScore[1]+(tScore[1] > 1 ? " pts" : " pt"))

        // On vide toutes les cases
        $(".case").html("&nbsp;")

        // On restaure l'événement "click" sur toutes les cases
        $(".case").click(gererUnePartie)
        $(".case").removeClass("pattern")

        // On masque les boutons
        $("#rejouer").css ('display', 'none')

        // Et on finit en (ré)initialisant le compteur de coups...
        nbCoups = 0

        // Et en lançant le tour de l'IA si c'est elle qui commence !
        gererIA()
    }

    function bordure() {
        // On affiche une bordure colorée autour de la zone du joueur actif, et on enlève celle autour de l'autre joueur (couleur blanc sur blanc = invisible)
        if (jCour) {
            $("#joueur-1").css('border', '5px solid white')
            $("#joueur-2").css('border', '5px solid #00007F')
        } else {
            $("#joueur-1").css('border', '5px solid #7F0000')
            $("#joueur-2").css('border', '5px solid white')
        }
    }

    function verifSchema(lim = 3) {
        let etat = -1 // -1 : jeu en cours / 0 : match nul / 1 : victoire
    
        nbCoups ++

        if (nbCoups > (2 * (lim - 1))) {
            let schema = tJoueur[jCour].repeat(lim)

            let schemaDiag1 = ""
            let schemaDiag2 = ""

            for (let lgn = 1 ; (etat < 1) && (lgn <= lim) ; lgn ++) {
                let schemaLgn = ""
                let schemaCol = ""

                for (let col = 1 ; (etat < 1) && (col <= lim) ; col ++) {
                    schemaLgn += $("#case-"+lgn+"-"+col).text()
                    schemaCol += $("#case-"+col+"-"+lgn).text()
    
                    if (lgn == col) 
                        schemaDiag1 += $("#case-"+lgn+"-"+col).text()
                    if ((lgn + col) == (lim + 1)) 
                        schemaDiag2 += $("#case-"+lgn+"-"+col).text()
                }
    
                if (schemaLgn == schema) {
                    etat = 1
                    for (let idx = 1 ; (idx <= lim) ; idx ++) {
                        $("#case-"+lgn+"-"+idx).addClass("pattern")
                    }
                } else if (schemaCol == schema) {
                    etat = 1
                    for (let idx = 1 ; (idx <= lim) ; idx ++) {
                        $("#case-"+idx+"-"+lgn).addClass("pattern")
                    }
                }
            }

            if (schemaDiag1 == schema) {
                etat = 1
                for (let idx = 1 ; (idx <= lim) ; idx ++) {
                    $("#case-"+idx+"-"+idx).addClass("pattern")
                }
            } else if (schemaDiag2 == schema) {
                etat = 1
                for (let idx = 1 ; (idx <= lim) ; idx ++) {
                    $("#case-"+idx+"-"+(lim-idx+1)).addClass("pattern")
                }
            } else if (nbCoups == (lim * lim)) {
                etat = 0
            }
        }

        return etat
    }

})
