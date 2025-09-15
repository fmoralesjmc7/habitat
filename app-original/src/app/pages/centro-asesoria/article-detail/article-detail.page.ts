import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { Article } from 'src/app/interfaces/article'; 
import { HeaderElements } from 'src/app/interfaces/header-elements';
import { articleDetailConstants } from './article-detail.constant';

@Component({
  selector: 'app-article-detail',
  templateUrl: './article-detail.page.html',
  styleUrls: ['./article-detail.page.scss'],
})
export class ArticleDetailPage implements OnInit {

  public article: Article;
  public typeArticle: string;
  public zoomIndex = 0;
  public zoomValues = articleDetailConstants.zoomValues;
  public headerElements: HeaderElements = articleDetailConstants.headerElements;
  constructor(private navCtrl: NavController,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    const param = this.activatedRoute.snapshot.queryParams.article;
    this.typeArticle = this.activatedRoute.snapshot.queryParams.type;
    if (this.typeArticle === 'principal') { this.headerElements.title = 'Artículo destacado'; }
    this.article = JSON.parse(param);
  }

  public goToArticles() {
    this.navCtrl.navigateBack('articles');
  }

  public getDate( date: string) {
    return new Date(date);
  }

  public zoomChange() {
    this.zoomIndex++;
    if (this.zoomIndex >= this.zoomValues.length) { this.zoomIndex = 0; }
  }

  public goTo(url: string) {
    if (url === 'home') {
      return this.navCtrl.pop();
    }
    this.navCtrl.navigateForward(url);
  }

}
