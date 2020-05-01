const fs = require('fs')
const data = require('../data.json')
const { age, date } = require('../utils.js')

exports.index = function(req, res) {
    return res.render("instructors/index", { instructors: data.instructors })
}

exports.show = function(req, res) {
    const { id } = req.params

    const foundInstructor = data.instructors.find(function(instructor) {
        return instructor.id == id
    })
    
    if (!foundInstructor) return res.send('instructor not found')
    
    // correcting data before send back to the front


    const instructor = {
        ...foundInstructor,
        age: age(foundInstructor.birth),
        services: foundInstructor.services.split(","),
        created_at: new Intl.DateTimeFormat("pt-BR").format(foundInstructor.created_at),

    }
    
    return res.render("instructors/show",{ instructor })
}

exports.create =  function(req, res) {
    return res.render("instructors/create")
}

exports.post = function(req, res) {

    // lets create the constructor and validate all the fields
    
    const keys = Object.keys(req.body)

    // validate before send the data, to see if there is any empty field

    for (key of keys) {
        if (req.body[key] == "") {
            return res.send('Please, fill all fields')
        }
    }

    // organizing the data I want to send

    let { avatar_url, birth, gender, services, name } = req.body

    // data processing - created_at and id were not created before in the body, so we have to create them here

    birth = Date.parse(birth)
    const created_at = Date.now()
    const id = Number(data.instructors.length + 1)
    
    // getting data and putting inside the instructors.js

    data.instructors.push({
        id,
        avatar_url,
        name,
        birth,
        gender,
        services,
        created_at,
    })
    
    // write inside the file data.json
    // constructor JSON.stringify transform the value to object notation

    fs.writeFile('data.json', JSON.stringify(data, null, 2), function(err){
        if (err) return res.send("Write file error")

        return res.redirect("/instructors")
    })
    //    return res.send(req.body)
}

exports.edit = function(req, res) {
    
    const { id } = req.params

    const foundInstructor = data.instructors.find(function(instructor) {
        return instructor.id == id
    })
    
    if (!foundInstructor) return res.send('instructor not found')

    const instructor = {
        ...foundInstructor,
        birth: date(foundInstructor.birth).iso
        
    }

    return res.render('instructors/edit', { instructor })
}

exports.put = function(req, res)
    {const { id } = req.body

    let index = 0

    const foundInstructor = data.instructors.find(function(instructor, foundIndex) {
        if (id == instructor.id) {
            index = foundIndex
            return true
        }  
    })

    if (!foundInstructor) return res.send('instructor not found')

    const instructor = {
        ...foundInstructor,
        ...req.body,
        birth: Date.parse(req.body.birth),
        id: Number(req.body.id)
    }

    data.instructors[index] = instructor

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err) {
        if(err) return res.send("Write error!")

        return res.redirect(`/instructors/${id}`)
    })
}

exports.delete = function(req, res) {
    const { id } = req.body

    const filteredInstructors = data.instructors.filter(function(instructor){
        return instructor.id != id

    })

    data.instructors = filteredInstructors

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err){
        if(err) return res.send("Write file error")
        
        return res.redirect("/instructors")
    })
        

}
