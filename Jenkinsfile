pipeline{
    agent any
    environment {
        PORT = credentials('port')
        MONGO_URI = credentials('mongo_uri')
        SECRET_KEY= credentials('secret_key')
        CLOUDINARY_API_KEY = credentials('cloudinary_api_key')
        CLOUDINARY_API_SECRET = credentials('cloudinary_api_secret')
        CLOUDINARY_API_NAME = credentials('cloudinary_api_name')
        REDIS_HOST = credentials('redis_host')
        REDIS_PORT = credentials('redis_port')
        REDIS_PASSWORD = credentials('redis_password')
    }
    stages{
        stage('Create .env file'){
            steps{
                sh """
                cat <<EOF > .env
                PORT=${PORT}
                MONGO_URI=${MONGO_URI}
                SECRET_KEY=${SECRET_KEY}
                CLOUDINARY_API_KEY=${CLOUDINARY_API_KEY}
                CLOUDINARY_API_SECRET=${CLOUDINARY_API_SECRET}
                CLOUDINARY_API_NAME=${CLOUDINARY_API_NAME}
                REDIS_HOST=${REDIS_HOST}
                REDIS_PORT=${REDIS_PORT}
                REDIS_PASSWORD=${REDIS_PASSWORD}
                EOF
                """
            }
        }
        stage('Login to Docker Hub'){
            steps{
            withCredentials([usernamePassword(credentialsId: 'docker_hub_cred', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                sh 'echo $DOCKER_PASSWORD | docker login -u $DOCKER_USERNAME --password-stdin'
            }
            }
        }
        stage('Build Docker Image'){
            steps{
                sh 'docker build -t bennyhinnbezawada/campus-connect-backend:latest .'
            }
        }
        stage('Push Docker Image to Docker Hub'){
            steps{
                sh 'docker push bennyhinnbezawada/campus-connect-backend:latest'
            }
        }
        stage('Pull from DockerHub'){
            steps{
                sh 'docker pull bennyhinnbezawada/campus-connect-backend:latest'
            }
        }
        stage('Stop and Remove Existing Container'){
            steps{
                sh 'docker stop campus-connect-backend || true'
                sh 'docker rm campus-connect-backend || true'
            }
        }
        stage('Run Latest Container'){
            steps{
                sh "|
         docker run -d -p 3101:3101 \
         --name campus-connect-backend \
         --env-file .env \
         --restart unless-stopped \
          bennyhinnbezawada/campus-connect-backend:latest"
            }
        }

    }
}