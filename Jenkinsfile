pipeline {
  agent any
  options { timestamps() }
  parameters {
    string(name: 'DOCKER_REGISTRY', defaultValue: '', description: 'Optional registry, e.g. docker.io/username')
    string(name: 'BACKEND_IMAGE', defaultValue: 'smart-notes-backend:latest', description: 'Backend image tag')
    string(name: 'FRONTEND_IMAGE', defaultValue: 'smart-notes-frontend:latest', description: 'Frontend image tag')
    booleanParam(name: 'PUSH', defaultValue: false, description: 'Push images to registry')
    booleanParam(name: 'DEPLOY', defaultValue: false, description: 'Deploy with docker-compose up -d')
  }
  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }
    stage('Backend Build') {
      steps {
        sh 'docker build -t ${BACKEND_IMAGE} -f backend/Dockerfile .'
      }
    }
    stage('Frontend Build') {
      steps {
        script {
          if (fileExists('frontend/Dockerfile')) {
            sh "docker build -t ${params.FRONTEND_IMAGE} -f frontend/Dockerfile ."
          } else {
            echo 'Skipping frontend build'
          }
        }
      }
    }
    stage('Push Images') {
      when { expression { return params.PUSH && params.DOCKER_REGISTRY?.trim() } }
      steps {
        script {
          sh "docker tag ${params.BACKEND_IMAGE} ${params.DOCKER_REGISTRY}/${params.BACKEND_IMAGE}"
          sh "docker push ${params.DOCKER_REGISTRY}/${params.BACKEND_IMAGE}"
          if (fileExists('frontend/Dockerfile')) {
            sh "docker tag ${params.FRONTEND_IMAGE} ${params.DOCKER_REGISTRY}/${params.FRONTEND_IMAGE}"
            sh "docker push ${params.DOCKER_REGISTRY}/${params.FRONTEND_IMAGE}"
          }
        }
      }
    }
    stage('Deploy') {
      when { expression { return params.DEPLOY } }
      steps {
        sh 'docker compose up -d'
      }
    }
  }
}
