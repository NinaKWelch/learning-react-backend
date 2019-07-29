require('dotenv').config()

const express = require('express')
const app = express()
const Note = require('./models/note')
const bodyParser = require('body-parser')
const cors = require('cors')

app.use(express.static('build'))
app.use(bodyParser.json()) // must be one of the first middlewares that are called
app.use(cors())

app.get('/api', (request, response) => {
  response.send('<h1>Notes API</h1>')
})

app.get('/api/notes', (request, response) => {
  Note.find({})
    .then(notes => {
      response.json(notes.map(note => note.toJSON()))
    })
})

app.post('/api/notes', (request, response, next) => {
  const body = request.body

  /* //
  if (!body.content) {
    return response.status(400).json({
      error: 'content missing'
    })
  }
  */

  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date()
  })

  note.save()
    .then(savedNote => savedNote.toJSON())
    .then(savedAndFormattedNote => {
      response.json(savedAndFormattedNote)
    }) 
    .catch(error => next(error))
})

app.get('/api/notes/:id', (request, response, next) => {
  Note.findById(request.params.id)
    .then(note => {
      if (note) {
        response.json(note.toJSON())
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/notes/:id', (request, response, next) => {
  Note.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
}) 

app.put('/api/notes/:id', (request, response, next) => {
  const body = request.body

  const note = {
    content: body.content,
    important: body.important,
  }

  Note.findByIdAndUpdate(request.params.id, note, { new: true })
    .then(updatedNote => {
      response.json(updatedNote.toJSON())
    })
    .catch(error => next(error))
})

// Catching errors - the handlers must be in this order
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError' && error.kind == 'ObjectId') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } 

  next(error)
}

app.use(errorHandler)

// server port
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})