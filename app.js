// Import express dan modul lainnya
// const express = require('express');
import fetch from 'node-fetch';
import express from 'express';
import ejs, { name } from 'ejs';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import bcrypt from 'bcrypt';


import path from 'path';
import { fileURLToPath } from 'url';
// const path = require('path');

const app = express();
const PORT = 3000;

// Tentukan __filename dan __dirname secara manual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set folder 'public' untuk file statis (CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));

// Set EJS untuk view
app.set('views', path.join(__dirname, 'views'));
app.engine('html', ejs.renderFile);
app.set('view engine', 'html');

// Route ke halaman utama
app.get('/', (req, res) => {
    res.render('index');
});

// Route untuk mendapatkan data user dari Laravel API
app.get('/users', async (req, res) => {
    try {
        const response = await fetch('http://127.0.0.1:8000/api/users'); // Ganti dengan URL Laravel API
        const users = await response.json();
        res.render('user', { users: users });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send('Error fetching users');
    }
});

// Jalankan server
app.listen(PORT, () => {
    console.log(`Server running at http://127.0.0.1:${PORT}`);
});
//Form Tambah Pengguna
app.get('/users/create',  (req, res) => {
    res.render('user_create');
});
//Tampilan Detail Pengguna 
app.get('/users/:id', async (req, res) => {
    try {
        const response = await fetch(`http://127.0.0.1:8000/api/users/${req.params.id}`);

        const users = await response.json();
        res.render('user_show', { user: users });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send('Error fetching users');
    }
});



//Tambah Pengguna 
app.post('/users', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const response = await fetch('http://127.0.0.1:8000/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: req.body.name,
                email: req.body.email,
                password: hashedPassword
            })
        });
        res.redirect('/users');
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send('Error fetching users');
    }
});


//Form Edit Pengguna 
app.get('/users/:id/edit', async (req, res) => {
    try {
        const response = await fetch(`http://127.0.0.1:8000/api/users/${req.params.id}`);

        const users = await response.json();
        res.render('user_update', { user: users });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send('Error fetching users');
    }
});



//Edit Pengguna 
app.put('/users/:id', async (req, res) => {
    try {
        const dataToUpdate = {
            name: req.body.name,
            email: req.body.email
        };
        if  (req.body.password) {
            const hashedPassword = await bcrypt.hash(req.body.password, 10); //Hash Jika Password diisi
            dataToUpdate.password = hashedPassword;
        }
        await fetch(`http://127.0.0.1:8000/api/users/${req.params.id}`,{

          method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataToUpdate)
        });
        res.redirect('/users');
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send('Error fetching users');
    }
});
//Hapus Pengguna
app.delete('/users/:id', async (req, res) => {
    try {
        await fetch(`http://127.0.0.1:8000/api/users/${req.params.id}`, {
          method: 'DELETE',
    
        });
        res.redirect('/users');
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send('Error fetching users');
    }
});
