import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatRippleModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { IonicModule } from '@ionic/angular';
import { ComponentsModule } from '../components/components.module';
import { LanguageModule } from '../language/language.module';
import { GenericInstructionComponent } from './generic-instruction/generic-instruction.component';
import { HighlightComponent } from './highlight/highlight.component';
import { HowToMultilangComponent } from './how-to-multilang/how-to-multilang.component';
import { HowToVideoComponent } from './how-to-video/how-to-video.component';
import { LanguageButtonComponent } from './language-button/language-button.component';
import { IndexPageComponent } from './pages/index-page/index-page.component';
import { SecondPageComponent } from './pages/second-page/second-page.component';
import { WelcomeRoutingModule } from './welcome-routing.module';
import { WelcomeComponent } from './welcome.component';

@NgModule({
  declarations: [
    WelcomeComponent,
    IndexPageComponent,
    SecondPageComponent,
    LanguageButtonComponent,
    HighlightComponent,
    GenericInstructionComponent,
    HowToVideoComponent,
    HowToMultilangComponent,
  ],
  imports: [
    CommonModule,
    LanguageModule,
    ComponentsModule,
    MatIconModule,
    MatRippleModule,
    WelcomeRoutingModule,
    IonicModule,
    MatDialogModule,
  ],
})
export class WelcomeModule {}
