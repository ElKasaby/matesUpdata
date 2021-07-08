const bodyParser = require('body-parser')
const passport = require('passport')
const JWT = require('jsonwebtoken')
const JwtStrategy = require('passport-jwt').Strategy
const { ExtractJwt } = require('passport-jwt')
const LocalStrategy = require('passport-local').Strategy
const GooglePlusTokenStrategy = require('passport-google-plus-token');
const FacebookTokenStrategy = require('passport-facebook-token')
const User = require('./api/models/user')


// JSON WEB TOKENS STRATEGY
passport.use(new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey:process.env.JWT_KEY ,
  passReqToCallback: true
}, async (req, payload, done) => {
  try {
    // Find the user specified in token
    const user = await User.findById(payload.sub);

    // If user doesn't exists, handle it
    if (!user) {
      return done(null, false);
    }

    // Otherwise, return the user
    req.user = user;
    done(null, user);
  } catch(error) {
    done(error, false);
  }
}));

// // GOOGLE OAUTH
// passport.use('googleToken',new GooglePlusTokenStrategy({
//   clientID:'539616226465-n5246pj7ujqe554m7p0qire1unj6id1a.apps.googleusercontent.com',
//   clientSecret:'QuYyeJKUFBsZZ8JsJeTzNBFV'
// },async(accessToken, refreshToken, profile, done)=>{
  
//   try{
//     console.log("accessToken:",accessToken);
//     console.log("refreshToken:",refreshToken);
//     console.log("profile:",profile);

//     // check whether this current user exist in our DB
//     const existingUser = await User.findOne({"google.id": profile.id})
//     if(existingUser){
//       return done(null, existingUser)
//     }
//     const image = profile.photos[0].value.substring(0);
//     console.log("image:",image);

//     // If new account
//     const newUSer = new User({
//       name: profile.displayName,
//       email: profile.emails[0].value,
//       image: image,
//       method: 'google',
//       google: {
//         id: profile.id,
//         name: profile.displayName,
//         email: profile.emails[0].value,
//         image: image
//       }
//     })
//     await newUSer.save()
//     done(null,newUSer)
//   }catch(error){
//     done(error,false)
//   }
// }))

// // Facebook OAuth
// passport.use('facebookToken', new FacebookTokenStrategy({
//   clientID:'224134619357094',
//   clientSecret:'d888065b2f7c6ee9c5be52d771b75304'
// },async(accessToken, refreshToken, profile, done)=>{
//   try{
//     console.log("accessToken:",accessToken);
//     console.log("refreshToken:",refreshToken);
//     console.log("profile:",profile);

//     // check whether this current user exist in our DB
//     const existingUser = await User.findOne({"facebook.id": profile.id})
//     if(existingUser){
//       return done(null, existingUser)
//     }
//     const image = profile.photos[0].value.substring(0);
//     console.log("image:",image);


//     // If new account
//     const newUSer = new User({
//       name: profile.displayName,
//       email: profile.emails[0].value,
//       image:image,
//       method: 'facebook',
//       facebook: {
//         id: profile.id,
//         name: profile.displayName,
//         email: profile.emails[0].value,
//         image:image
//       }
//     })
//     await newUSer.save()
//     done(null,newUSer)


//   }catch(error){
//     done(error, false, error.message)
//   }
// }))





// LOCAL STRATEGY
passport.use(new LocalStrategy({
  usernameField: 'email'
}, async (email, password, done) => {
  try {
    // Find the user given the email
    const user = await User.findOne({ "email": email });
    

    // If not, handle it
    if (!user) {
      return done(null, false);
    }
    // Activeted email
    if (!user.enabled) {
      return done(null, false);
    }

    // Check if the password is correct
    const isMatch = await user.isValidPassword(password);
    // If not, handle it
    if (!isMatch) {
      return done(null, false);
    }
  
    // Otherwise, return the user
    done(null, user);
  } catch(error) {
    done(error, false);
  }
}));