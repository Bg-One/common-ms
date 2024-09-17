FROM openjdk:8-jre
COPY *.jar /app.jar
# 执行创建app.jar
EXPOSE 8080
# 向外暴露的接口，最好与项目yml文件中的端口一致
ENTRYPOINT ["java","-jar","app.jar"]


