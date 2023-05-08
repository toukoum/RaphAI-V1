// attendre que la page se charge entièremment
// window.addEventListener("DOMContentLoaded", (event) => {
window.addEventListener('load', function() {
    $("#answer-text").text("");

    var csrf = $("input[name=csrfmiddlewaretoken]").val();

    // Récupérez le form
    const questionForm = document.getElementById("question-form");


    // Récupérez la vidéo
    const video = document.getElementById("video-avatar");


    questionForm.addEventListener("submit", (event) => {
        // Empêcher le comportement de soumission par défaut du formulaire
        event.preventDefault();

        // Récupérer la valeur de l'input question
        const questionInput = document.getElementById("inputField");
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
                    // document.getElementById("answer-text").textContent += mots[i] + " ";
                    // const answerBoxDivs = document.querySelectorAll('.answer-box');
                    // const lastAnswerBoxDiv = answerBoxDivs[answerBoxDivs.length - 1];
                    // const lastParagraph = lastAnswerBoxDiv.querySelector('p:last-of-type');
                    // lastParagraph.textContent += " " + mots[i] + " ";

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



