pipeline {
    agent any

    environment {
        AWS_REGION = "ap-south-1"
        ECR_REPO = "sports-nexus"
        ECR_REGISTRY = "834922934378.dkr.ecr.ap-south-1.amazonaws.com"
        IMAGE_TAG = "${BUILD_NUMBER}"

        CLUSTER_NAME = "sports-nexus-eks"

        APP_REPO = "https://github.com/prasannakumaryendluri-45/sports-nexus-app.git"
        HELM_REPO = "https://github.com/prasannakumaryendluri-45/sports-nexus-helm.git"
    }

    stages {

        stage('Checkout Code') {
            steps {
                git branch: 'main', url: "${APP_REPO}"
            }
        }

        stage('Build Backend (Maven)') {
            steps {
                dir('backend') {
                    sh 'mvn clean package -DskipTests'
                }
            }
        }

        stage('SonarQube Analysis') {
            environment {
                SONAR_TOKEN = credentials('sonar-token')
            }
            steps {
                dir('backend') {
                    sh '''
                        mvn clean verify sonar:sonar \
                        -Dsonar.host.url=http://13.201.15.127:9000 \
                        -Dsonar.login=$SONAR_TOKEN
                    '''
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                dir('backend') {
                    sh '''
                        docker build -t $ECR_REPO:$IMAGE_TAG .
                        docker tag $ECR_REPO:$IMAGE_TAG $ECR_REGISTRY/$ECR_REPO:$IMAGE_TAG
                    '''
                }
            }
        }

        stage('Push to ECR') {
            steps {
                sh '''
                    aws ecr get-login-password --region $AWS_REGION \
                    | docker login --username AWS --password-stdin $ECR_REGISTRY

                    docker push $ECR_REGISTRY/$ECR_REPO:$IMAGE_TAG
                '''
            }
        }

        stage('Update Helm Values (GitOps)') {
    environment {
        GIT_USER = "prasannakumaryendluri-45"
        GIT_TOKEN = credentials('github-token')
    }

    steps {
        sh '''
            set -e

            rm -rf sports-nexus-helm
            git clone https://github.com/prasannakumaryendluri-45/sports-nexus-helm.git

            cd sports-nexus-helm/sports-nexus

            sed -i "s|tag:.*|tag: ${IMAGE_TAG}|g" values.yaml

            git config user.email "jenkins-ci@sportsnexus.com"
            git config user.name "jenkins-ci"

            git add values.yaml
            git commit -m "update image tag ${IMAGE_TAG}" || echo "no changes"

            git push https://${GIT_USER}:${GIT_TOKEN}@github.com/${GIT_USER}/sports-nexus-helm.git main
        '''
    }
}
}
}
