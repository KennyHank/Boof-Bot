pipeline {
  agent {
    node {
      label 'Test'
    }

  }
  stages {
    stage('TestStage') {
      parallel {
        stage('TestStage') {
          steps {
            echo 'Hello'
          }
        }

        stage('') {
          steps {
            powershell(script: 'echo "Test Script"', returnStdout: true)
          }
        }

      }
    }

  }
  environment {
    env1 = '3'
  }
}