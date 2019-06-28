module.exports.setField = async (field, data, resolve, reject) => {
    try {
      await db.set(field, {
        ...data
      });
      await db.save();
  
      return resolve();
    } catch(e) {
      console.log(e);
  
      return reject(e);
    }
  }
  
  module.exports.validationPhoto = (photoName, photoSize, name, price) => {
    if (photoName === '' || photoSize === 0) {
      return { status: 'Image is not load!', err: true };
    }
  
    if (!name) {
      return { status: 'Enter name!', err: true };
    }
  
    if (!price) {
      return { status: 'Enter price!', err: true };
    }
    return { status: 'Ok', err: false };
  };
  