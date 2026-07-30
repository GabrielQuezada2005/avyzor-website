"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TESTIMONIALS } from "@/lib/constants";

export function Testimonials() {
  return (
    <section id="bewertungen" className="section-padding relative">
      <div className="container-premium mx-auto">
        <SectionHeading
          subtitle="Kundenstimmen"
          title="Was unsere Kunden sagen"
          description="Vertrauen, das wir täglich mit exzellenter Arbeit verdienen."
        />

        <p className="text-center text-white/30 text-xs mb-8 max-w-2xl mx-auto">
          Beispielzitate zur Illustration – echte Kundenstimmen auf Anfrage verfügbar.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {TESTIMONIALS.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="premium-card relative"
            >
              <Quote
                size={32}
                className="text-gold-500/20 absolute top-6 right-6"
              />

              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className="text-gold-400"
                    fill="currentColor"
                  />
                ))}
              </div>

              <p className="text-white/70 leading-relaxed mb-6 text-sm">
                &ldquo;{testimonial.content}&rdquo;
              </p>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gold-gradient flex items-center justify-center text-dark-900 font-bold text-sm">
                  {testimonial.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <div className="text-white font-medium text-sm">
                    {testimonial.name}
                  </div>
                  <div className="text-white/40 text-xs">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
