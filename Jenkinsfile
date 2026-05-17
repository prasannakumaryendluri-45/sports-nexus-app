pipeline {
    agent any

    environment {
        AWS_REGION = "us-east-1"
        ECR_REPO = "834922934378.dkr.ecr.us-east-1.amazonaws.com/sports-nexus-backend"
        IMAGE_TAG = "latest"
        SONAR_HOST = "http://3.235.0.90:9000"
    }

    stages {

        stage('Checkout') {
            steps {
                git branch: 'main', url: 'YOUR_GITHUB_REPO_URL'
            }
        }

        stage('Build Maven') {
            steps {
                sh 'cd backend && mvn clean package -DskipTests'
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('sonar-server') {
                    sh '''
                    cd backend
                    mvn sonar:sonar \
                    -Dsonar.projectKey=sports-nexus \
                    -Dsonar.host.url=$SONAR_HOST \
                    -Dsonar.login=YOUR_SONAR_TOKEN
                    '''
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                sh '''
                docker build -t sports-nexus-backend ./backend
                docker tag sports-nexus-backend:latest $ECR_REPO:$IMAGE_TAG
                '''
            }
        }

        stage('Login to ECR') {
            steps {
                sh '''
                aws ecr get-login-password --region $AWS_REGION \
                | docker login --username AWS --password-stdin $ECR_REPO
                '''
            }
        }

        stage('Push to ECR') {
            steps {
                sh '''
                docker push $ECR_REPO:$IMAGE_TAG
                '''
            }
        }
    }
}
