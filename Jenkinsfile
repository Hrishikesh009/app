pipeline {
    agent any

    environment {
        DOCKER_USER = 'hrishi001'
        DOCKER_REPO = 'app'
        IMAGE = "${DOCKER_USER}/${DOCKER_REPO}"
        DOCKERHUB_CRED = 'dockerhub-creds'
        DEPLOY_DIR = '/home/ubuntu/app-deploy'
    }

    stages {
      
        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                sh """
                    docker build -t ${IMAGE}:${BUILD_NUMBER} .
                    docker tag ${IMAGE}:${BUILD_NUMBER} ${IMAGE}:latest
                """
            }
        }

        stage('Login & Push to DockerHub') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: DOCKERHUB_CRED,
                    usernameVariable: 'USER',
                    passwordVariable: 'PASS'
                )]) {
                    sh """
                        echo "$DOCKER_PASS" | docker login -u "$USER" --password-stdin
                        docker push ${IMAGE}:${BUILD_NUMBER}
                        docker push ${IMAGE}:latest
                    """
                }
            }
        }

        stage('Deploy Locally on Same VM') {
            steps {
                sh """
                    # Create deploy directory if missing
                    mkdir -p ${DEPLOY_DIR}
                    cd ${DEPLOY_DIR}

                    # Write fresh docker-compose.yml
                    cat > docker-compose.yml <<EOF
version: "3.9"
services:
  web:
    image: ${IMAGE}:latest
    container_name: app_container
    restart: always
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: production
      PORT: 3000
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
EOF

                    # Pull latest image
                    docker pull ${IMAGE}:latest

                    # Restart container
                    docker compose down || true
                    docker compose up -d
                """
            }
        }
    }

    post {
        success {
            echo "🎉 Deployment SUCCESSFUL!"
        }
        failure {
            echo "❌ Deployment FAILED!"
        }
    }
}

