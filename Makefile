build:
	docker build -t docker-react-image:1.0 .
run:
	docker run -d -p 3006:3006 --name docker-react-container docker-react-image:1.0
