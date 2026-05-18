pipeline {
    agent any

    environment {
        AWS_REGION = "ap-south-1"
        ECR_REPO = "sports-nexus"
        ECR_REGISTRY = "834922934378.dkr.ecr.ap-south-1.amazonaws.com"
        IMAGE_TAG = "${BUILD_NUMBER}"
        CLUSTER_NAME = "sports-nexus-eks"
    }

    stages {

        stage('Checkout') {
            steps {
                git branch: 'main',
                url: 'https://github.com/YOUR_USERNAME/YOUR_REPO.git'
            }
        }

        stage('Maven Build') {
            steps {
                sh 'mvn clean package -DskipTests'
            }
        }

        stage('SonarQube Scan') {
            steps {
                sh '''
                mvn sonar:sonar \
                -Dsonar.host.url=http://localhost:9000 \
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
        sh """
        git clone https://github.com/YOUR_USERNAME/sports-nexus-helm.git
        cd sports-nexus-helm/sports-nexus

        sed -i 's/tag: .*/tag: ${BUILD_NUMBER}/' values.yaml

        git config user.email "jenkins@devops.com"
        git config user.name "jenkins"

        git add .
        git commit -m "update image tag ${BUILD_NUMBER}"
        git push
        """
    }
}
       stage('Update Helm Image Tag') {
    steps {
        sh """
        git clone https://github.com/YOUR_USERNAME/sports-nexus-helm.git
        cd sports-nexus-helm/sports-nexus

        sed -i 's/tag: .*/tag: ${BUILD_NUMBER}/' values.yaml

        git config user.email "jenkins@devops.com"
        git config user.name "jenkins"

        git add .
        git commit -m "update image tag ${BUILD_NUMBER}"
        git push
        """
    }
}




    }
}
