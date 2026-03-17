import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import WhatsAppButton from "@/components/whatsapp-button"
import ContactForm from "@/components/contact-form"
import LocationMap from "@/components/location-map"
import { Phone, Mail, MapPin, Clock, Instagram, MessageCircle } from "lucide-react"

export const metadata = {
  title: "Contact Us | SISA_Cake",
  description: "Get in touch with SISA_Cake. Send us a message, call us, or visit our location.",
}

const contactInfo = [
  {
    icon: Phone,
    title: "Phone / WhatsApp",
    value: "+1 234 567 890",
    link: "https://wa.me/1234567890",
  },
  {
    icon: Mail,
    title: "Email",
    value: "hello@sisacake.com",
    link: "mailto:hello@sisacake.com",
  },
  {
    icon: Instagram,
    title: "Instagram",
    value: "@sisa_cake",
    link: "https://instagram.com/sisa_cake",
  },
  {
    icon: Clock,
    title: "Working Hours",
    value: "Mon-Sat: 9AM - 6PM",
    link: null,
  },
]

export default function ContactPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      
      {/* Page Header */}
      <section className="pt-32 pb-16 gradient-luxury">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            <span className="text-gradient">Get In</span>{" "}
            <span className="text-foreground">Touch</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Have questions or want to place an order? We would love to hear from you. 
            Send us a message and we will respond as soon as possible.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Info & Social */}
            <div className="space-y-8 animate-fade-in-up">
              <div>
                <h2 className="text-3xl font-bold mb-6">Contact Information</h2>
                <p className="text-muted-foreground mb-8 leading-relaxed">
                  Reach out to us through any of these channels. We typically respond 
                  within 2-4 hours during business hours.
                </p>
              </div>

              {/* Contact Cards */}
              <div className="grid sm:grid-cols-2 gap-4">
                {contactInfo.map((info, index) => (
                  <div
                    key={index}
                    className="p-5 rounded-2xl bg-card border border-border shadow-md hover:shadow-lg transition-shadow"
                  >
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <info.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-1">{info.title}</h3>
                    {info.link ? (
                      <a 
                        href={info.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        {info.value}
                      </a>
                    ) : (
                      <p className="text-muted-foreground">{info.value}</p>
                    )}
                  </div>
                ))}
              </div>

              {/* Quick Contact Buttons */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Quick Contact</h3>
                <div className="flex flex-wrap gap-4">
                  <a
                    href="https://wa.me/1234567890"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-green-500 text-white font-semibold hover:bg-green-600 transition-colors"
                  >
                    <MessageCircle className="w-5 h-5" />
                    WhatsApp
                  </a>
                  <a
                    href="mailto:hello@sisacake.com"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
                  >
                    <Mail className="w-5 h-5" />
                    Email Us
                  </a>
                  <a
                    href="https://instagram.com/sisa_cake"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:opacity-90 transition-opacity"
                  >
                    <Instagram className="w-5 h-5" />
                    Instagram
                  </a>
                </div>
              </div>

              {/* Location Card */}
              <div className="p-6 rounded-3xl bg-card border border-border shadow-lg">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Our Location</h3>
                    <p className="text-muted-foreground">
                      123 Bakery Street, Sweet Town<br />
                      New York, NY 10001
                    </p>
                  </div>
                </div>
                <LocationMap />
              </div>
            </div>

            {/* Contact Form */}
            <div className="animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </main>
  )
}
