pipeline {
    agent any

    environment {
        telegramBotToken = credentials('telegram-bot-token')
        telegramChatId = credentials('telegram-chat-id')
        ezjotAPIsalt = credentials('ezjotAPIsalt')
        ezjotAPIkey = credentials('ezjotAPIkey')
    }

    stages {
        stage('Informing through telegram') {
            steps {
                sh "curl -sS https://api.telegram.org/bot$telegramBotToken/sendMessage -d chat_id=$telegramChatId -d text='🔨 Building ${env.JOB_NAME} #${env.BUILD_NUMBER}...'"
            }
        }

        stage('Purge') {
            steps {
                echo 'Stopping container and removing current container..'
                sh "docker stop ezjot || true && docker rm ezjot || true"
                echo 'Done'
            }
        }

        stage('Prepare environment') {
            steps {
                echo 'Creating .env file...'
                writeFile file: '.env', text: """
                    DATABASE_URL="file:../db/ezjot.db"
                    API_SALT=${ezjotAPIsalt}
                    API_KEY=${ezjotAPIkey}
                """
                echo 'Done'
            }
        }

        stage('Build') {
            steps {
                echo 'Building new image..'
                sh "docker build . -t ezjot"
                echo 'Done'
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deploying....'
                sh "docker run -d -p 7171:3000 --name ezjot --env-file .env ezjot:latest"
                echo 'Done'
            }
        }
    }

    post {
        failure {
            script {
                def message = "❌ Build failed for ${env.JOB_NAME} #${env.BUILD_NUMBER}."
                sh "curl -sS https://api.telegram.org/bot$telegramBotToken/sendMessage -d chat_id=$telegramChatId -d text='${message}'"
            }
        }

        success {
            script {
                def prUrl = ''
                try {
                    def prNumber = sh(
                        script: 'git ls-remote --exit-code --heads origin "pull/*/head" | cut -d"/" -f3',
                        returnStdout: true
                    ).trim()
                    prUrl = "https://github.com/c4lyp5o/ezjot/pull/${prNumber}"
                } catch (e) {
                    // Do nothing
                }
                def message = "✅ Build succeeded for ${env.JOB_NAME} #${env.BUILD_NUMBER}."
                if (prUrl != '') {
                    message += "\n🔗 PR: ${prUrl}"
                }
                sh "curl -sS https://api.telegram.org/bot$telegramBotToken/sendMessage -d chat_id=$telegramChatId -d text='${message}'"
            }
        }
    }
}
