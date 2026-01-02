import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Branch } from '../models/branch.model';

@Injectable({ providedIn: 'root' })
export class BranchService {
    private readonly SESSION_KEY = 'selectedBranchId';

    branches = signal<Branch[]>([]);
    selectedBranch = signal<Branch | null>(null);

    constructor(private http: HttpClient) {
        const storedId = sessionStorage.getItem(this.SESSION_KEY);
        if (storedId) {
            // selectedBranch will be reconciled after branches load
            this.selectedBranch.set({ _id: storedId, name: '', address: '', phone: '' });
        }
    }

    loadBranches() {
        this.http.get<Branch[]>('http://localhost:3000/branches').subscribe({
            next: (list) => {
                this.branches.set(list || []);
                const storedId = sessionStorage.getItem(this.SESSION_KEY);
                if (storedId) {
                    const match = list.find((b) => b._id === storedId) || null;
                    this.selectedBranch.set(match);
                }
            },
            error: () => {
                this.branches.set([]);
            }
        });
    }

    selectBranch(branch: Branch | null) {
        this.selectedBranch.set(branch);
        if (branch?._id) {
            sessionStorage.setItem(this.SESSION_KEY, branch._id);
        } else {
            sessionStorage.removeItem(this.SESSION_KEY);
        }
    }
}
