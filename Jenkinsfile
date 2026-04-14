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

        stage('Inspect Workspace') {
            steps {
                bat 'dir'
            }
        }

        stage('Install Backend Dependencies') {
            steps {
                dir('backend') {
                    bat 'python -m pip install --upgrade pip'
                    bat 'pip install -r requirements-ci.txt'
                    bat 'pip install bandit semgrep'
                }
            }
        }

        stage('Lint / Syntax Check') {
            steps {
                dir('backend') {
                    bat 'python -m compileall app'
                }
            }
        }

        stage('Run Bandit') {
            steps {
                dir('backend') {
                    bat 'bandit -r app -f txt -o bandit-report.txt || exit /b 0'
                }
            }
        }

        stage('Run Semgrep') {
            steps {
                dir('backend') {
                    bat 'semgrep --config auto app --text --output semgrep-report.txt || exit /b 0'
                }
            }
        }

        stage('Install Frontend Dependencies') {
            steps {
                dir('frontend') {
                    bat 'npm install'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    bat 'npm run build'
                }
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: 'backend/bandit-report.txt,backend/semgrep-report.txt', allowEmptyArchive: true
        }
        success {
            echo 'Pipeline completed successfully.'
        }
        failure {
            echo 'Pipeline failed. Check stage logs.'
        }
    }
}
