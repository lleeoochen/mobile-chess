//
//  ViewController.swift
//  mobile-chess
//
//  Created by Leo Chen on 2020/6/19.
//  Copyright © 2020 Leo Chen. All rights reserved.
//

import UIKit
import WebKit

class ViewController: UIViewController {

    @IBOutlet weak var webview: WKWebView!

    override func viewDidLoad() {
        super.viewDidLoad()

        let userAgent = "Mozilla/5.0 (Windows NT 5.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.116 Safari/537.36 Mozilla/5.0 (iPad; U; CPU OS 3_2 like Mac OS X; en-us) AppleWebKit/531.21.10 (KHTML, like Gecko) Version/4.0.4 Mobile/7B334b Safari/531.21.10";

        let url = URL(string: "https://weitungchen.com/web-chess")
        let url_request = URLRequest(url: url!);

//        url_request.setValue(userAgent, forHTTPHeaderField:"user-agent")
        webview.customUserAgent = userAgent;
        webview.load(url_request)
    }

}

