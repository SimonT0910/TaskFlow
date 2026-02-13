create database TaskFlow;
use TaskFlow;

--Tabla de usuarios

create table usuarios (
    usuario_id int primary key identity(1,1),
    nombre varchar(20) not null,
    apellido varchar(20) not null,
    email varchar(50) unique not null,
    contrasena varchar(100) not null,
    fecha datetime default getdate(),
    password_hash varchar(255) not null default 'temp_hash',
    activo bit not null default 1,
    creado datetime default getdate()
);

--Tabla de estados

create table estados (
    estado_id int primary key identity(1,1),
    nombre varchar(10) not null
);

insert into estados (nombre) values ('Pendiente'), ('En curso'), ('Finalizado');

--Tabla de proyectos

create table proyectos (
    proyecto_id int primary key identity(1,1),
    nombre varchar(100) not null,
    admin_usuario_id int not null,
    admin_password_hash varchar(255) not null,
    creado datetime default getdate(),
    foreign key (admin_usuario_id) references usuarios(usuario_id)
);

--Tabla de usuarios_proyectos

create table usuarios_proyectos (
    usuario_id int not null,
    proyecto_id int not null,
    creado datetime default getdate(),
    primary key (usuario_id, proyecto_id),
    foreign key (usuario_id) references usuarios(usuario_id),
    foreign key (proyecto_id) references proyectos(proyecto_id)
);

--Tabla de tasks

create table tasks (
    task_id int primary key identity(1,1),
    proyecto_id int not null,
    usuario_id int not null,            
    asignado int null,                    
    titulo varchar(100) not null,
    descripcion varchar(max) not null,
    estado_id int not null,
    prioridad int,
    fecha_estimada date,
    tiempo int,
    creado datetime default getdate(),
    actualizado datetime default getdate(),
    admin_in bit not null default 0,       
    foreign key (usuario_id) references usuarios(usuario_id),
    foreign key (asignado) references usuarios(usuario_id),
    foreign key (estado_id) references estados(estado_id),
    foreign key (proyecto_id) references proyectos(proyecto_id)
);

--Tabla de calendario

create table calendario (
    evento_id int primary key identity(1,1),
    usuario_id int not null,
    titulo varchar(100) not null,
    descripcion varchar(max) not null,
    comienzo date,
    final date,
    subtareas int null,
    foreign key (usuario_id) references usuarios(usuario_id),
    foreign key (subtareas) references tasks(task_id)
);

--Tabla de historial

create table historial (
    historial_id int primary key identity(1,1),
    task_id int not null,
    usuario_id int not null,
    estado_anterior int,
    nuevo_estado int,
    cambio datetime default getdate(),
    comentario varchar(max),
    foreign key (task_id) references tasks(task_id),
    foreign key (usuario_id) references usuarios(usuario_id)
);

--Tabla de sugerenciasIA

create table sugerenciasIA (
    sugerencia_id int primary key identity(1,1),
    usuario_id int not null,
    tipo varchar(50),
    sugerencia varchar(max),
    creada datetime default getdate(),
    apicado bit default 0,
    task_id int null,
    foreign key (usuario_id) references usuarios(usuario_id),
    foreign key (task_id) references tasks(task_id)
);

--Tabla de recomendacionesIA

create table recomendacionesIA (
    log_id int primary key identity(1,1),
    usuario_id int not null,
    input_text varchar(max),
    output_text varchar(max),
    creado datetime default getdate(),
    foreign key (usuario_id) references usuarios(usuario_id)
);

select * from tasks