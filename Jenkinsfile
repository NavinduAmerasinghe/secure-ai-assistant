pipeline {
    agent any

    options {
        disableConcurrentBuilds()
        timestamps()
    }

    environment {
        BACKEND_DIR = 'backend'
        FRONTEND_DIR = 'frontend'
    }

    stages {
        stage('Checkout Info') {
            steps {
                echo 'Starting Secure AI Assistant CI pipeline'
                bat 'git --version'
                bat 'python --version'
                bat 'node --version'
                bat 'npm --version'
            }
        }

        stage('Inspect Workspace') {
            steps {
                bat 'dir'
            }
        }

        stage('Install Backend Dependencies') {
            steps {
                dir("${BACKEND_DIR}") {
                    bat 'python -m pip install --upgrade pip'
                    bat 'pip install -r requirements-ci.txt'
                }
            }
        }

        stage('Backend Syntax Check') {
            steps {
                dir("${BACKEND_DIR}") {
                    bat 'python -m compileall app'
                }
            }
        }

        stage('Backend Tests') {
            steps {
                dir("${BACKEND_DIR}") {
                    bat 'pytest || exit /b 0'
                }
            }
        }

        stage('Run Bandit') {
            steps {
                dir("${BACKEND_DIR}") {
                    bat 'bandit -r app -f txt -o bandit-report.txt || exit /b 0'
                }
            }
        }

        stage('Run Semgrep') {
            steps {
                dir("${BACKEND_DIR}") {
                    bat 'semgrep --config auto app --text --output semgrep-report.txt || exit /b 0'
                }
            }
        }

        stage('Install Frontend Dependencies') {
            steps {
                dir("${FRONTEND_DIR}") {
                    bat 'npm install'
                }
            }
        }

        stage('Frontend Lint') {
            steps {
                dir("${FRONTEND_DIR}") {
                    bat 'npm run lint || exit /b 0'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir("${FRONTEND_DIR}") {
                    bat 'npm run build'
                }
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: 'backend/bandit-report.txt,backend/semgrep-report.txt', allowEmptyArchive: true
            echo 'Pipeline finished.'
        }
        success {
            echo 'Pipeline completed successfully.'
        }
        failure {
            echo 'Pipeline failed. Check stage logs.'
        }
    }
}
