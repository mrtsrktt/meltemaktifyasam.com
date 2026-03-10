"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Ayşe K.",
    initials: "AK",
    text: "Meltem Hanım sayesinde 3 ayda 12 kilo verdim. Sadece kilo değil, hayatım değişti!",
    role: "Girişimci",
    rating: 5,
  },
  {
    name: "Fatma D.",
    initials: "FD",
    text: "Tiroit sorunum için fonksiyonel beslenme programı hayatımı kurtardı. Enerjim arttı, cildim güzelleşti.",
    role: "Öğretmen",
    rating: 5,
  },
  {
    name: "Mehmet Y.",
    initials: "MY",
    text: "Sporcu beslenmesi konusundaki bilgisi olağanüstü. Performansım gözle görülür şekilde arttı.",
    role: "Fitness Antrenörü",
    rating: 5,
  },
];

export default function TestimonialsSection() {
  const t = useTranslations("testimonials");

  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold text-brand-dark sm:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {t("subtitle")}
          </p>
        </motion.div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
            >
              <Card className="h-full border-0 shadow-md">
                <CardContent className="p-8">
                  <div className="flex gap-1">
                    {Array.from({ length: testimonial.rating }).map((_, j) => (
                      <Star
                        key={j}
                        className="h-4 w-4 fill-brand-orange text-brand-orange"
                      />
                    ))}
                  </div>
                  <p className="mt-4 text-muted-foreground leading-relaxed">
                    &ldquo;{testimonial.text}&rdquo;
                  </p>
                  <div className="mt-6 flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-brand-green/10 text-brand-green font-semibold">
                        {testimonial.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-brand-dark">
                        {testimonial.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
