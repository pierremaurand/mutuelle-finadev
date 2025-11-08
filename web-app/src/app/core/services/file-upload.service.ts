import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable, tap } from 'rxjs';
import { UploadImage } from '../models/upload-image';
import { UploadResponse } from '../models/upload-response';
import { LoadingService } from './loading.service';

@Injectable({
  providedIn: 'root',
})
export class FileUploadService {
  baseUrl: string = environment.baseUrl + '/fileUpload';
  constructor(
    private http: HttpClient,
    private loadingService: LoadingService
  ) {}

  uploadFile(image: UploadImage): Observable<UploadResponse> {
    this.loadingService.setLoadingStatus(true);
    return this.http
      .post<UploadResponse>(`${this.baseUrl}`, image)
      .pipe(tap(() => this.loadingService.setLoadingStatus(false)));
  }

  public blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        // The result will be a data URL (e.g., "data:image/png;base64,...")
        // which contains the Base64 encoded string.
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('FileReader result is not a string.'));
        }
      };

      reader.onerror = (error) => {
        reject(error);
      };

      // Read the Blob content as a data URL
      reader.readAsDataURL(blob);
    });
  }
}
