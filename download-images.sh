#!/bin/sh
# Run once from this folder: downloads the 7 images that used to load from Pexels/Unsplash.
cd "$(dirname "$0")/assets/img/local" || exit 1
for id in 3861969 590022 3182812 264636; do
  curl -fsSL -o "pexels-$id.jpg" "https://images.pexels.com/photos/$id/pexels-photo-$id.jpeg?auto=compress&cs=tinysrgb&w=1200"
done
for id in 1556306535-0f09a537f0a3 1604719312566-8912e9227c6a; do
  curl -fsSL -o "unsplash-$id.jpg" "https://images.unsplash.com/photo-$id?auto=format&fit=crop&w=800&q=85"
done

