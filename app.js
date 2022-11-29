const sequelize = require("./dbConfig");
const fs = require("fs")
const moment = require("moment")
const path = require("path")
const RegisteredMsisdn = require("./model")

const {Op} = require("sequelize")


const inputFile = path.join("input_dir", `${moment().format("YYYY-MM-DD")}.lst`)

sequelize.sync()
    .then(() => {
        fs.readFile(inputFile, {encoding: "utf-8"}, async (fileError, fileContent) => {
            if (fileError) throw fileError;
            if (!data) return
            const data = fileContent.trim().split("\n");
            if (data.length > 0) {
                let finalArray = []
                const setCard = new Set();
                const mapMsisdnCard = new Map()
                for (const dataElement of data) {
                    const [msisdn, ghCard, businessName] = dataElement.split(",")
                    setCard.add(ghCard)
                    mapMsisdnCard.set(msisdn, {ghCard, businessName})
                }
                try {
                    const dataRegistered = await RegisteredMsisdn.findAll({
                        where: {
                            cardNumber: {
                                [Op.in]: [...setCard]
                            }
                        },
                        attributes: ['cardNumber', 'surname', 'transaction_id', 'suuid', 'staffId', 'originalPayload'],
                        raw: true
                    })


                    let mapDBData = new Map()
                    for (const el of dataRegistered) {
                        const {cardNumber} = el
                        mapDBData.set(cardNumber, el)
                    }


                    for (const [k, v] of mapMsisdnCard) {
                        const {ghCard, businessName} = v
                        finalArray.push({...mapDBData.get(ghCard), msisdn: k, customer_type: "EXISTING", businessName})
                    }

                } catch (ex) {
                    console.log(ex)
                }
                try {
                    await RegisteredMsisdn.bulkCreate(finalArray, {ignoreDuplicates: true})
                    console.log(`Total Inserted : ${finalArray.length}`)
                } catch (ex) {
                    console.log(ex)
                }
            }

        })
    }).catch(ex => {
    console.log(ex)
    console.log("Unable to connect to MYSQL DB")
})
