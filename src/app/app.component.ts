import { Component, ElementRef, Inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import * as THREE from 'three';
import { isPlatformBrowser } from '@angular/common';
const PI2 = Math.PI * 2;
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'Portfolio';
  @ViewChild('threeContainer', { static: true }) threeContainer!: ElementRef;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private particles: THREE.Sprite[] = [];
  private count = 0;
  private windowHalfX = window.innerWidth / 2;
  private windowHalfY = window.innerHeight / 2;

  private readonly SEPARATION = 50;
  private readonly AMOUNTX = 60;
  private readonly AMOUNTY = 30;
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}


  
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.init();
      this.animate();
    }
  }
  generateSprite(): THREE.Texture {
    const canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 16;
  
    const context = canvas.getContext('2d');
    if (context) {
      context.beginPath();
      context.arc(8, 8, 7, 0, PI2, true);
      context.fill();
    }
  
    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
  
    return texture;
  }
  private init(): void {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(120, window.innerWidth / window.innerHeight, 1, 10000);
    this.camera.position.y = 180;
    this.camera.position.z = 20;
    this.camera.rotation.x = 0.35;

    
    const material = new THREE.SpriteMaterial({
      color: 0xffffff,
      map: this.generateSprite(),
    });

    let i = 0;

    for (let ix = 0; ix < this.AMOUNTX; ix++) {
      for (let iy = 0; iy < this.AMOUNTY; iy++) {
        const particle = new THREE.Sprite(material);
        particle.position.x = ix * this.SEPARATION - (this.AMOUNTX * this.SEPARATION) / 2;
        particle.position.z = iy * this.SEPARATION - (this.AMOUNTY * this.SEPARATION) - 10;
        this.particles[i++] = particle;
        this.scene.add(particle);
      }
    }

    this.renderer = new THREE.WebGLRenderer();

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(0x000000, 1);

    if (this.threeContainer) {
      this.threeContainer.nativeElement.appendChild(this.renderer.domElement);
    }

    window.addEventListener('resize', this.onWindowResize.bind(this), false);
  }

  private onWindowResize(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.windowHalfX = window.innerWidth / 2;
      this.windowHalfY = window.innerHeight / 2;
  
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
  
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
  }

  private animate(): void {
    requestAnimationFrame(() => this.animate());
    this.render();
  }

  private render(): void {
    let i = 0;

    for (let ix = 0; ix < this.AMOUNTX; ix++) {
      for (let iy = 0; iy < this.AMOUNTY; iy++) {
        const particle = this.particles[i++];
        particle.position.y =
          Math.sin((ix + this.count) * 0.5) * 15 + Math.sin((iy + this.count) * 0.5) * 15;
        particle.scale.x = particle.scale.y =
          (Math.sin((ix + this.count) * 0.5) + 2) * 4 + (Math.sin((iy + this.count) * 0.5) + 1) * 4;
      }
    }

    this.renderer.render(this.scene, this.camera);
    this.count += 0.05;
  }
}
