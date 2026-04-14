pipeline {
    agent any

    stages {
        stage('Checkout Info') {
            steps {
                echo 'Starting Secure AI Assistant pipeline'
                bat 'git --version'
                bat 'python --version'
            }
        }

        stage('Install Backend Dependencies') {
            steps {
                bat '''
                cd backend
                python -m pip install --upgrade pip
                pip install -r requirements.txt
                '''
            }
        }

        stage('Lint / Syntax Check') {
            steps {
                bat '''
                cd backend
                python -m compileall app
                '''
            }
        }

        stage('Run Bandit') {
            steps {
                bat '''
                cd backend
                bandit -r app -f json -o bandit-report.json
                '''
            }
        }

        stage('Run Semgrep') {
            steps {
                bat '''
                cd backend
                semgrep --config=auto app --json --output semgrep-report.json
                '''
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: 'backend/*-report.json', fingerprint: true, allowEmptyArchive: true
        }
        success {
            echo 'Pipeline completed successfully'
        }
        failure {
            echo 'Pipeline failed'
        }
    }
}