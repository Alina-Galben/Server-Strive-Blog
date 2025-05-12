import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import authorModel from '../models/authorSchema.js'
import dotenv from 'dotenv'

dotenv.config()

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3002/auth/google/callback",
      passReqToCallback: true,
      prompt: "select_account" // 👈 forza la selezione account
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        // Controlla se esiste già un autore con questo Google ID
        let user = await authorModel.findOne({ googleId: profile.id })

        if (!user) {
          // Se non esiste, lo crea
          user = new authorModel({
            nome: profile.name.givenName,
            cognome: profile.name.familyName || "GoogleUser",
            username: profile.emails[0].value.split('@')[0],
            email: profile.emails[0].value,
            avatar: profile.photos[0].value,
            googleId: profile.id,
            password: 'google_oauth', // campo placeholder
          })

          await user.save()
        }

        return done(null, user)
      } catch (err) {
        return done(err, null)
      }
    }
  )
)

// Serializzazione e de serializzazione 
passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
  try {
    const user = await authorModel.findById(id)
    done(null, user)
  } catch (err) {
    done(err, null)
  }
})
