<!DOCTYPE html>
<html lang="pl">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="quiz.css">
        <title>Quiz</title>
    </head>
    <body>
        <header>
            <h1>
                Quiz
            </h1>
        </header>
        <main>
            <section class="sections-area center">
                <section class="panel center hidden" id="task1">
                   
                </section>
                <section class="panel center hidden" id="task2">

                </section>
                <section class="panel center hidden" id="task3">
                
                </section>
                <section class="panel center hidden" id="task4">

                </section>
                <section class="panel center hidden" id="task5">

                </section>
            </section>
        </main>
        <section class="form-popup form-area hidden">
            <article class="form-popup form-box center">
                <h4 class="task-header form-popup">
                    You have completed quiz! to check your score fill out the form so we will know who get the highest score
                </h4>
                <form method="post">
                    <div class="form-popup input-arr horizontal-center">
                        <div class="form-popup input-pla">
                            <input type="text" name="name" id="name" placeholder="name" class="form-popup form-input">
                        </div>
                        <div class="form-popup input-pla">
                            <input type="text" name="surname" id="surname" placeholder="surname" class="form-popup form-input">
                        </div>
                    </div>
                    <button type="submit" class="form-popup form-submit" onclick="createcookie()">Send</button>
                </form>
                <?
                    if ($_POST['name'] && $_POST['surname']) {
                        $conn = mysqli_connect('db100072499', 'db100072499@localhost','9YTjT07kpIscM','db100072499');

                        $name = $_POST['name'];
                        $surname = $_POST['surname'];
                    }
                ?>
                <p class="form-popup form-addnotation">
                    Your data is used only for registering your score on our database. After 10 days from sending data will be deleted.
                </p>
            </article>
        </section>
    </body>
    <script src="./basequestions.js"></script>
    <script src="./quiz_useb.js"></script>
</html>