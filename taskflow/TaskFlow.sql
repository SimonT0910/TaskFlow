create database TaskFlow;
use TaskFlow;

create table usuarios(
usuario_id int primary key identity (1,1),
nombre varchar(20) not null,
apellido varchar (20) not null,
email varchar (50) unique not null,
contrasena varchar(100) unique not null,
fecha datetime default getdate(),
);

create table estados (
estado_id int identity primary key,
nombre varchar(10) not null
);

insert into estados (nombre) values ('Pendiente'), ('En curso'), ('Finalizado');

create table tasks (
task_id int identity primary key,
usuario_id int not null,
titulo varchar(100) not null,
descripcion varchar(max) not null,
estado_id int not null,
prioridad int,
fecha_estimada date,
tiempo int,
creado datetime default getdate(),
actualizado datetime default getdate(),
foreign key (usuario_id) references usuarios(usuario_id),
foreign key (estado_id) references estados(estado_id)
);

create table calendario(
evento_id int identity primary key,
usuario_id int not null,
titulo varchar(100) not null,
descripcion varchar(max) not null,
comienzo date,
final date,
subtareas int null,
foreign key (usuario_id) references usuarios(usuario_id),
foreign key (subtareas) references tasks(task_id)
);

create table historial(
historial_id int identity primary key,
task_id int not null,
usuario_id int not null,
estado_anterior int,
nuevo_estado int,
cambio datetime default getdate(),
comentario varchar(max),
foreign key (task_id) references tasks(task_id),
foreign key (usuario_id) references usuarios(usuario_id)
);

create table sugerenciasIA(
sugerencia_id int identity primary key,
usuario_id int not null,
tipo varchar(50),
sugerencia varchar(max),
creada datetime default getdate(),
apicado bit default 0,
task_relacionado int null,
foreign key (usuario_id) references usuarios(usuario_id),
foreign key (task_relacionado) references tasks(task_id)
);

create table recomendacionesIA(
log_id int identity primary key,
usuario_id int not null,
input_text varchar(max),
output_text varchar(max),
creado datetime default getdate(),
foreign key (usuario_id) references usuarios(usuario_id)
);