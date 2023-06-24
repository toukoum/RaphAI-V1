// attendre que la page se charge entièremment
// window.addEventListener("DOMContentLoaded", (event) => {
window.addEventListener('load', function() {
    /*======*/
   /* texte intro*/
    const questionInput = document.getElementById("inputField");

    questionInput.disabled = true;
    const video = document.getElementById("video-avatar");

    const text_intro = "Bonjour ! <br><br> Je suis l'avatar de Raphaël Giraud. Vous pouvez me poser n'importe quelle question au sujet de ma vie, et je serai ravi d'y répondre. Vous pouvez par exemple me demander des informations personnelles sur ma vie ou mes études. <br> (Pour l'instant, Raph.AI est juste une version BETA, ce qui signifie que des bugs peuvent être présents, ce qui rendra les réponses inexactes.)"
    console.log(text_intro)
    const mots = text_intro.split(" ");

    let i = 0;


    const interval2 = setInterval(() => {

        const lastAnswerBoxDiv = document.querySelector('.answer-box:last-child');
        const lastParagraph = lastAnswerBoxDiv.children[lastAnswerBoxDiv.children.length - 1];
        lastParagraph.value = ""
        lastParagraph.innerHTML += " " + mots[i] + " ";


        video.play();


        i++;
        if (i >= mots.length) {
            clearInterval(interval2);
            video.pause();
            video.currentTime = 0; // Remet la vidéo à zéro



            // Ajouter les nouveaux paragraphes à la div .answer-box
            // Générer un identifiant unique
            const id = "answer-" + Date.now();

            // Créer un nouveau paragraphe avec l'identifiant unique et le texte de la réponse
            const newAnswer = '<div class="answer-box">' +
                                 '<p class="name-ia">RaphA.I. :</p>' +
                                 '<p id="' + id + '"></p>' +
                              '</div>';

            // Ajouter le nouveau paragraphe à la fin de la div answer-box
            $(".answer-box-box").append(newAnswer);
            questionInput.disabled = false;


        }
    }, 200); // Délai en millisecondes entre chaque mot














    $("#answer-text").text("");

    // var csrf = $("input[name=csrfmiddlewaretoken]").val();

    // Récupérez le form
    const questionForm = document.getElementById("question-form");


    // Récupérez la vidéo


    questionForm.addEventListener("submit", (event) => {
        // Empêcher le comportement de soumission par défaut du formulaire
        event.preventDefault();
        questionInput.disabled = true;


        // Récupérer la valeur de l'input question
        const question = questionInput.value;
        questionInput.value = "";
        // Afficher la question dans la console
        console.log("Question posée : ", question);


        // Ajouter les points de chargement
        const loadingDots = document.createElement('div');
        loadingDots.innerHTML = '<p class="loading-dots">.</p>';

        const lastAnswerBoxDiv = document.querySelector('.answer-box:last-child');
        lastAnswerBoxDiv.appendChild(loadingDots);




        $.ajax({
            url: '/get_answer/',
            type: 'POST',
            data: {
                question: question,
                csrfmiddlewaretoken: csrf
            },
            success: function (data) {
                // Afficher la réponse de l'API Hugging Face
                console.log(data.answer)
                const text = data.answer;
                const mots = text.split(" ");

                let i = 0;
                video.play();


                loadingDots.remove();
                const interval = setInterval(() => {
            

                    const lastAnswerBoxDiv = document.querySelector('.answer-box:last-child');
                    const lastParagraph = lastAnswerBoxDiv.children[lastAnswerBoxDiv.children.length - 1];
                    lastParagraph.value = ""
                    lastParagraph.textContent += " " + mots[i] + " ";



                    i++;
                    if (i >= mots.length) {
                        clearInterval(interval);
                        video.pause();
                        video.currentTime = 0; // Remet la vidéo à zéro



                        // Ajouter les nouveaux paragraphes à la div .answer-box
                        // Générer un identifiant unique
                        const id = "answer-" + Date.now();

                        // Créer un nouveau paragraphe avec l'identifiant unique et le texte de la réponse
                        const newAnswer = '<div class="answer-box">' +
                                             '<p class="name-ia">RaphA.I. :</p>' +
                                             '<p id="' + id + '"></p>' +
                                          '</div>';

                        // Ajouter le nouveau paragraphe à la fin de la div answer-box
                        $(".answer-box-box").append(newAnswer);
                        questionInput.disabled = false;

                    }
                }, 200); // Délai en millisecondes entre chaque mot

                video.addEventListener("ended", () => {
                    if (i < mots.length) {
                        video.loop = true;
                        video.currentTime = 0;

                        video.play();

                    }
                });






            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(textStatus, errorThrown);
            }
        });

    });
});



