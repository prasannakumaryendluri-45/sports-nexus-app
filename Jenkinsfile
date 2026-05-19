pipeline {
    agent any

    environment {
        AWS_REGION = "ap-south-1"
        ECR_REPO = "sports-nexus"
        ECR_REGISTRY = "834922934378.dkr.ecr.ap-south-1.amazonaws.com"
        IMAGE_TAG = "${BUILD_NUMBER}"
        CLUSTER_NAME = "sports-nexus-eks"
        GIT_REPO = "https://github.com/prasannakumaryendluri-45/sports-nexus-app.git"
        HELM_REPO = "https://github.com/prasannakumaryendluri-45/sports-nexus-helm.git"
    }

    stages {

        stage('Checkout') {
            steps {
                git branch: 'main', url: "${GIT_REPO}"
            }
        }

        stage('Maven Build') {
    steps {
        dir('backend') {
            sh 'mvn clean package -DskipTests'
        }
    }
}

        stage('SonarQube Scan') {
            steps {
                sh '''
                mvn sonar:sonar \
                -Dsonar.host.url=http://13.201.15.127:9000 \
                -Dsonar.login=admin
                '''
            }
        }

        stage('Docker Build') {
            steps {
                sh '''
                docker build -t $ECR_REPO:$IMAGE_TAG .
                docker tag $ECR_REPO:$IMAGE_TAG $ECR_REGISTRY/$ECR_REPO:$IMAGE_TAG
                '''
            }
        }

        stage('ECR Login & Push') {
            steps {
                sh '''
                aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR_REGISTRY
                docker push $ECR_REGISTRY/$ECR_REPO:$IMAGE_TAG
                '''
            }
        }

        stage('Deploy to EKS') {
            steps {
                sh '''
                aws eks update-kubeconfig --region $AWS_REGION --name $CLUSTER_NAME

                kubectl set image deployment/sports-nexus-app \
                app=$ECR_REGISTRY/$ECR_REPO:$IMAGE_TAG \
                --record || true
                '''
            }
        }

        stage('Update Helm Image Tag') {
            steps {
                sh '''
                rm -rf sports-nexus-helm
                git clone $HELM_REPO
                cd sports-nexus-helm/sports-nexus

                sed -i "s/tag: .*/tag: ${IMAGE_TAG}/" values.yaml

                git config user.email "jenkins@devops.com"
                git config user.name "jenkins"

                git add .
                git commit -m "update image tag ${IMAGE_TAG}" || echo "No changes"
                git push
                '''
            }
        }
    }
}
