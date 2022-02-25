const Employee = require('../model/Employee');

const create = async (req, res) => {
    if (!req?.body?.firstname || !req?.body?.lastname) {
        return res.status(400).json({ message: 'First and last names are required.' });
    }

    try {
        const result = await Employee.create({
            firstname: req.body.firstname,
            lastname: req.body.lastname
        });

        res.status(201).json(result);
    } catch (error) {
        console.error(error);
    }
}

const read = async (req, res) => {
    if (!req.params?.id) return res.status(400).json({ message: `ID parameter is required.` });

    const employee = await Employee.findOne({ _id: req.params.id }).exec();

    if (!employee) {
        return res.status(204).json({ 'message': `No employee matches the ID: ${req.body.id}.` });
    }
    res.json(employee);
}

const list = async (req, res) => {
    const employees = await Employee.find();

    if (!employees) return res.status(204).json({ message: 'No employees found.' });
    res.json(employees);
}

const update = async (req, res) => {
    if (!req?.body?.id) {
        return res.status(400).json({ message: `ID parameter is required.` });
    }

    const employee = await Employee.findOne({ _id: req.body.id }).exec();

    if (!employee) {
        return res.status(204).json({ 'message': `No employee matches the ID: ${req.body.id}.` });
    }
    if (req.body?.firstname) employee.firstname = req.body.firstname;
    if (req.body?.lastname) employee.lastname = req.body.lastname;
    const result = await employee.save();
    res.json(result);
}

const destroy = async (req, res) => {
    if (!req?.body?.id) return res.status(400).json({ message: `ID parameter is required.` });

    const employee = await Employee.findOne({ _id: req.body.id }).exec();

    if (!employee) {
        return res.status(204).json({ 'message': `No employee matches the ID: ${req.body.id}.` });
    }

    const result = await Employee.deleteOne({ _id: req.body.id });
    res.json(result);
}

module.exports = {
    create, 
    read,
    list,
    update,
    delete: destroy
}